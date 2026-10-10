export interface AppConfig {
  port: number;
  mongoUri: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  jwtAccessExpiresIn: string;
  jwtRefreshExpiresIn: string;
  uploadDir: string;
  maxFileSize: number;
}

export default (): AppConfig => ({
  port: Number(process.env.PORT ?? 3000),
  mongoUri: process.env.MONGO_DB_URI,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '1d',
  uploadDir: process.env.UPLOAD_DIR ?? './uploads',
  maxFileSize: Number(process.env.MAX_FILE_SIZE ?? 5 * 1024 * 1024),
});
