import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { getMessage } from '../common/messages';

const ALLOWED_MIME_TYPES = ['image/jpeg'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg'];

const uploadDir = (): string => process.env.UPLOAD_DIR ?? './uploads';

// Multer options are built at module-import time (before NestJS DI is available),
// so they read process.env directly. dotenv is loaded first in main.ts.
export const mediaMulterOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      const dir = uploadDir();
      mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${randomUUID()}${ext}`);
    },
  }),
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE ?? 5 * 1024 * 1024),
  },
  fileFilter: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    const valid = ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext);

    if (valid) {
      cb(null, true);
    } else {
      cb(new BadRequestException(getMessage('INVALID_FILE_TYPE')), false);
    }
  },
};
