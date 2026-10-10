import { NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';

import { MediaDocument } from '../../media/schemas/media.schema';
import { getMessage } from '../messages';

export async function resolveMediaById(
  mediaModel: Model<MediaDocument>,
  id: string,
): Promise<MediaDocument> {
  if (!isValidObjectId(id)) {
    throw new NotFoundException(getMessage('MEDIA_NOT_FOUND'));
  }

  const media = await mediaModel.findById(id).exec();
  if (!media) {
    throw new NotFoundException(getMessage('MEDIA_NOT_FOUND'));
  }

  return media;
}
