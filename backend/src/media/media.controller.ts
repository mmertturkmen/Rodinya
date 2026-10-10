import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Media as MediaParam } from '../common/decorators/media.decorator';
import { MediaAccessGuard } from '../common/guards/media-access.guard';
import { MediaOwnerGuard } from '../common/guards/media-owner.guard';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { PermissionsDto } from './dto/permissions.dto';
import {
  ApiDelete,
  ApiDownload,
  ApiGetById,
  ApiGetPermissions,
  ApiListMine,
  ApiUpdatePermission,
  ApiUpload,
} from './media.docs';
import { MediaService } from './media.service';
import { mediaMulterOptions } from './multer.config';
import { MediaDocument } from './schemas/media.schema';

@ApiTags('media')
@ApiBearerAuth('access-token')
@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly configService: ConfigService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', mediaMulterOptions))
  @ApiUpload()
  async upload(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: AuthenticatedUser) {
    const media = await this.mediaService.create(user.userId, file);
    return this.mediaService.toResponse(media);
  }

  @Get('my')
  @ApiListMine()
  async listMine(@CurrentUser() user: AuthenticatedUser) {
    const media = await this.mediaService.listByOwner(user.userId);
    return media.map((item) => this.mediaService.toResponse(item));
  }

  @Get(':id')
  @UseGuards(MediaAccessGuard)
  @ApiGetById()
  getById(@MediaParam() media: MediaDocument) {
    return this.mediaService.toResponse(media);
  }

  @Get(':id/download')
  @UseGuards(MediaAccessGuard)
  @ApiDownload()
  download(@MediaParam() media: MediaDocument): StreamableFile {
    const filePath = join(this.configService.get<string>('uploadDir'), media.filePath);
    const stream = createReadStream(filePath);

    return new StreamableFile(stream, {
      type: media.mimeType,
      disposition: `attachment; filename="${media.fileName}"`,
      length: media.size,
    });
  }

  @Delete(':id')
  @UseGuards(MediaOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDelete()
  async delete(@MediaParam() media: MediaDocument): Promise<void> {
    await this.mediaService.remove(media);
  }

  @Get(':id/permissions')
  @UseGuards(MediaOwnerGuard)
  @ApiGetPermissions()
  getPermissions(@MediaParam() media: MediaDocument) {
    return this.mediaService.permissions(media);
  }

  @Post(':id/permissions')
  @UseGuards(MediaOwnerGuard)
  @ApiUpdatePermission()
  updatePermission(@MediaParam() media: MediaDocument, @Body() dto: PermissionsDto) {
    return this.mediaService.updatePermission(media, dto.userId, dto.action);
  }
}
