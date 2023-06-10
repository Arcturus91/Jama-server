import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { jwtConstants } from 'src/constants/jtw.constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, public loger: Logger) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const { id, type } = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      if (type === 'user') {
        request['user'] = { id, type };
        Logger.log('user data from jwt', request.user);
      } else if (type === 'chef') {
        request['chef'] = { id, type };
        Logger.log('chef data from jwt', request.chef);
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
