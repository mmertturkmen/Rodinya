import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { MediaDocument } from '../../media/schemas/media.schema';

export const Media = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): MediaDocument => {
    const request = ctx.switchToHttp().getRequest();
    return request.media;
  },
);
