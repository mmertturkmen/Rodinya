import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { promises as fs } from 'fs';
import { isValidObjectId, Model, Types } from 'mongoose';
import { join } from 'path';

import { getMessage } from '../common/messages';
import { UsersService } from '../users/users.service';
import { Media, MediaDocument } from './schemas/media.schema';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @InjectModel(Media.name)
    private readonly mediaModel: Model<MediaDocument>,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async create(ownerId: string, file: Express.Multer.File): Promise<MediaDocument> {
    if (!file) {
      throw new BadRequestException(getMessage('FILE_REQUIRED'));
    }

    const media = new this.mediaModel({
      ownerId,
      fileName: file.originalname,
      filePath: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      allowedUserIds: [],
    });

    const saved = await media.save();
    this.logger.log(`${getMessage('MEDIA_UPLOADED')} (media=${saved._id}, owner=${ownerId})`);
    return saved;
  }

  async listByOwner(ownerId: string): Promise<MediaDocument[]> {
    const media = await this.mediaModel.find({ ownerId }).exec();
    this.logger.log(getMessage('MEDIA_LISTED'));
    return media;
  }

  async remove(media: MediaDocument): Promise<void> {
    await this.mediaModel.deleteOne({ _id: media._id }).exec();

    const filePath = join(this.configService.get<string>('uploadDir'), media.filePath);
    await fs.unlink(filePath).catch(() => undefined);

    this.logger.log(`${getMessage('MEDIA_DELETED')} (media=${media._id})`);
  }

  permissions(media: MediaDocument) {
    return { allowedUserIds: media.allowedUserIds };
  }

  async updatePermission(
    media: MediaDocument,
    userId: string,
    action: 'add' | 'remove',
  ): Promise<{ allowedUserIds: Types.ObjectId[] }> {
    if (!isValidObjectId(userId)) {
      throw new NotFoundException(getMessage('USER_NOT_FOUND'));
    }

    const target = await this.usersService.findById(userId);
    if (!target) {
      throw new NotFoundException(getMessage('USER_NOT_FOUND'));
    }

    const objectId = new Types.ObjectId(userId);
    const update =
      action === 'add'
        ? { $addToSet: { allowedUserIds: objectId } }
        : { $pull: { allowedUserIds: objectId } };

    const updated = await this.mediaModel
      .findByIdAndUpdate(media._id, update, { new: true })
      .exec();

    this.logger.log(
      `${getMessage('PERMISSION_UPDATED')} (media=${media._id}, user=${userId}, action=${action})`,
    );
    return { allowedUserIds: updated.allowedUserIds };
  }

  toResponse(media: MediaDocument) {
    return {
      id: media._id,
      ownerId: media.ownerId,
      fileName: media.fileName,
      mimeType: media.mimeType,
      size: media.size,
      createdAt: media.createdAt,
    };
  }
}
