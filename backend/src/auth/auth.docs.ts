import { applyDecorators } from '@nestjs/common';

import {
  ApiBadRequest,
  ApiConflict,
  ApiCreated,
  ApiOk,
  ApiUnauthorized,
} from '../common/decorators/api-docs.decorator';

export function ApiRegister() {
  return applyDecorators(
    ApiCreated('Register a new user', 'User created'),
    ApiBadRequest(),
    ApiConflict('Email already registered'),
  );
}

export function ApiLogin() {
  return applyDecorators(
    ApiOk('Login and receive tokens', 'Access and refresh tokens'),
    ApiUnauthorized(),
  );
}

export function ApiRefresh() {
  return applyDecorators(ApiOk('Refresh the access token', 'New token pair'), ApiUnauthorized());
}
