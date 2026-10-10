import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../messages';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const startedAt = Date.now();

    this.logger.log(`${getMessage('HTTP_REQUEST')} ${method} ${originalUrl}`);

    res.on('finish', () => {
      const duration = Date.now() - startedAt;
      const userId = req.user?.userId ?? 'anonymous';
      this.logger.log(
        `${getMessage('HTTP_RESPONSE')} ${method} ${originalUrl} -> ${res.statusCode} (${duration}ms, user=${userId})`,
      );
    });

    next();
  }
}
