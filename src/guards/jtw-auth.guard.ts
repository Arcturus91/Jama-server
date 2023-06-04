import {
  CanActivate,
  ExecutionContext,
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
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      if (payload.type === 'user') {
        request['user'] = payload;
        Logger.log('user data from jwt', request.user);
      } else if (payload.type === 'chef') {
        request['chef'] = payload;
        Logger.log('chef data from jwt', request.chef);
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const headers: any = request.headers;
    console.log('i am headers cookie', headers.cookie);
    const cookies = headers.cookie;
    if (!cookies) {
      Logger.log('No cookies found');
      return undefined;
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
