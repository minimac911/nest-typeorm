import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function LoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  Logger.debug(
    `📝  ${req.headers['user-agent'].split(') ')[0]})`,
    'Bootstrap',
    false,
  );
  next();
}
