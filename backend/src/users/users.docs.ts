import { applyDecorators } from '@nestjs/common';

import { ApiOk, ApiUnauthorized } from '../common/decorators/api-docs.decorator';

export function ApiGetMe() {
  return applyDecorators(
    ApiOk('Get current authenticated user', 'User profile'),
    ApiUnauthorized(),
  );
}
