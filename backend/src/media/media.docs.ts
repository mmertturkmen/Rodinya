import { applyDecorators } from '@nestjs/common';

import {
  ApiBadRequest,
  ApiCreated,
  ApiFileBody,
  ApiForbidden,
  ApiMediaId,
  ApiNoContent,
  ApiNotFound,
  ApiOk,
  ApiPayloadTooLarge,
  ApiUnauthorized,
} from '../common/decorators/api-docs.decorator';

export function ApiUpload() {
  return applyDecorators(
    ApiCreated('Upload a JPEG image', 'Media uploaded'),
    ApiFileBody(),
    ApiBadRequest('Invalid file type'),
    ApiUnauthorized(),
    ApiPayloadTooLarge(),
  );
}

export function ApiListMine() {
  return applyDecorators(ApiOk("List current user's media", 'Media list'), ApiUnauthorized());
}

export function ApiGetById() {
  return applyDecorators(
    ApiOk('Get media metadata', 'Media metadata'),
    ApiMediaId(),
    ApiUnauthorized(),
    ApiForbidden(),
    ApiNotFound(),
  );
}

export function ApiDownload() {
  return applyDecorators(
    ApiOk('Download media file', 'Media file'),
    ApiMediaId(),
    ApiUnauthorized(),
    ApiForbidden(),
    ApiNotFound(),
  );
}

export function ApiDelete() {
  return applyDecorators(
    ApiNoContent('Delete media (owner only)', 'Deleted'),
    ApiMediaId(),
    ApiUnauthorized(),
    ApiForbidden(),
    ApiNotFound(),
  );
}

export function ApiGetPermissions() {
  return applyDecorators(
    ApiOk('List media permissions (owner only)', 'Permissions'),
    ApiMediaId(),
    ApiUnauthorized(),
    ApiForbidden(),
    ApiNotFound(),
  );
}

export function ApiUpdatePermission() {
  return applyDecorators(
    ApiOk('Add or remove a permission (owner only)', 'Updated permissions'),
    ApiMediaId(),
    ApiUnauthorized(),
    ApiForbidden(),
    ApiNotFound(),
  );
}
