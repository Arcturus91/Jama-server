/* eslint-disable prettier/prettier */
import { Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');
    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl } = req;
        res.on('finish', () => {
            const { statusCode } = res;
            this.logger.log(
                `${method} ${originalUrl} ${statusCode}`,
            );
        });
        next();
    }
}
