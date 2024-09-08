import * as session from 'express-session';
import { NestMiddleware, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: any, res: any, next: () => void) {
    session({
      secret: this.configService.get<string>('SESSION_SECRET', 'default_secret_key'),
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === 'production' },
    })(req, res, next);
  }
}
