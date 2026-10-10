import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

// ---- Success ----

export function ApiOk(summary: string, description = 'Success') {
  return applyDecorators(ApiOperation({ summary }), ApiResponse({ status: 200, description }));
}

export function ApiCreated(summary: string, description = 'Created') {
  return applyDecorators(ApiOperation({ summary }), ApiResponse({ status: 201, description }));
}

export function ApiNoContent(summary: string, description = 'No content') {
  return applyDecorators(ApiOperation({ summary }), ApiResponse({ status: 204, description }));
}

// ---- Common errors ----

export function ApiBadRequest(description = 'Validation error') {
  return ApiResponse({ status: 400, description });
}

export function ApiUnauthorized() {
  return ApiResponse({ status: 401, description: 'Unauthorized' });
}

export function ApiForbidden() {
  return ApiResponse({ status: 403, description: 'Forbidden' });
}

export function ApiNotFound(description = 'Not found') {
  return ApiResponse({ status: 404, description });
}

export function ApiConflict(description = 'Conflict') {
  return ApiResponse({ status: 409, description });
}

export function ApiPayloadTooLarge(description = 'File too large') {
  return ApiResponse({ status: 413, description });
}

// ---- Helpers ----

export function ApiFileBody() {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: { file: { type: 'string', format: 'binary' } },
      },
    }),
  );
}

export function ApiMediaId() {
  return ApiParam({ name: 'id', type: String, description: 'Media id' });
}
