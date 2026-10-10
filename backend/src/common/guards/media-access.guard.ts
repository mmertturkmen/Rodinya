import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Media, MediaDocument } from '../../media/schemas/media.schema';
import { getMessage } from '../messages';
import { resolveMediaById } from './media-resolver';

@Injectable()
export class MediaAccessGuard implements CanActivate {
  constructor(
    @InjectModel(Media.name)
    private readonly mediaModel: Model<MediaDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const media = await resolveMediaById(this.mediaModel, request.params.id);

    const userId = request.user?.userId;
    const isOwner = media.ownerId.toString() === userId;
    const isAllowed = media.allowedUserIds.some((allowedId) => allowedId.toString() === userId);

    if (!isOwner && !isAllowed) {
      throw new ForbiddenException(getMessage('ACCESS_DENIED'));
    }

    request.media = media;
    return true;
  }
}
