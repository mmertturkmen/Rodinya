import type { MediaDocument } from '../../media/schemas/media.schema';

declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      role: string;
    }

    interface Request {
      media?: MediaDocument;
    }
  }
}

export {};
