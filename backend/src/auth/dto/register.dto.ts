import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

import { getMessage } from '../../common/messages';

export class RegisterDto {
  @ApiProperty({ example: 'x@y.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Passw0rd!' })
  @IsStrongPassword({ minLength: 8 }, { message: getMessage('WEAK_PASSWORD') })
  password: string;
}
