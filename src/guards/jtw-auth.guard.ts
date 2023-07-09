import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    public loger: Logger,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const { id, type } = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      if (type === 'user') {
        request['user'] = { id, type };
        Logger.log('user data from jwt', request.user);
      } else if (type === 'chef') {
        request['chef'] = { id, type };
        Logger.log('chef data from jwt', request.chef);
      } else if (type === 'admin') {
        request['admin'] = { id, type };
        Logger.log('AdminData', request.chef);
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const headers: any = request.headers;
    const cookies = headers.cookie;
    if (!cookies) {
      Logger.log('No cookies found');
      throw new HttpException(
        'Necesitas logearte primero',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const cookiePairs = cookies.split(';');
    const jwtCookiePair = cookiePairs.find((pair) =>
      pair.trim().startsWith('Authentication='),
    );

    if (jwtCookiePair) {
      const jwtCookie = jwtCookiePair.split('=')[1];
      console.log('JWT cookie:', jwtCookie);
      return jwtCookie;
    } else {
      return undefined;
    }
  }
}
