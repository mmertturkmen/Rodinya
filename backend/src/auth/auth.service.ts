import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { getMessage } from '../common/messages';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(getMessage('EMAIL_EXISTS'));
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create(dto.email, passwordHash);

    this.logger.log(`${getMessage('REGISTER_SUCCESS')} (user=${user._id})`);
    return this.usersService.toSafeUser(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException(getMessage('INVALID_CREDENTIALS'));
    }

    const tokens = await this.issueTokens(this.toPayload(user));

    this.logger.log(`${getMessage('LOGIN_SUCCESS')} (user=${user._id})`);
    return tokens;
  }

  async refresh(dto: RefreshDto) {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(dto.refreshToken, {
        secret: this.configService.get<string>('jwtRefreshSecret'),
      });
    } catch {
      throw new UnauthorizedException(getMessage('INVALID_REFRESH_TOKEN'));
    }

    const tokens = await this.issueTokens({
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    });

    this.logger.log(`${getMessage('TOKEN_REFRESHED')} (user=${payload.sub})`);
    return tokens;
  }

  private toPayload(user: UserDocument): JwtPayload {
    return { sub: user._id.toString(), email: user.email, role: user.role };
  }

  private async issueTokens(payload: JwtPayload) {
    const accessSecret = this.configService.get<string>('jwtAccessSecret');
    const refreshSecret = this.configService.get<string>('jwtRefreshSecret');
    const accessExpiresIn = this.configService.get<string>(
      'jwtAccessExpiresIn',
    ) as JwtSignOptions['expiresIn'];
    const refreshExpiresIn = this.configService.get<string>(
      'jwtRefreshExpiresIn',
    ) as JwtSignOptions['expiresIn'];

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
