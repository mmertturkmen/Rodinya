export const en = {
  HTTP_REQUEST: 'Incoming request',
  HTTP_RESPONSE: 'Request completed',

  REGISTER_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'User logged in successfully',
  TOKEN_REFRESHED: 'Access token refreshed',
  EMAIL_EXISTS: 'Email is already registered',
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
  WEAK_PASSWORD:
    'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number and one symbol',

  MEDIA_UPLOADED: 'Media uploaded',
  MEDIA_LISTED: 'Media list retrieved',
  MEDIA_DELETED: 'Media deleted',
  PERMISSION_UPDATED: 'Permission updated',
  ACCESS_DENIED: 'Access denied',
  MEDIA_NOT_FOUND: 'Media not found',
  USER_NOT_FOUND: 'User not found',
  INVALID_FILE_TYPE: 'Only JPEG images are allowed',
  FILE_REQUIRED: 'File is required',

  HEALTH_OK: 'Health check passed',
} as const;
