import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class UserAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('session', request.session);
    if (request.session.type !== 'user') {
      throw new UnauthorizedException('You must be user to access this route');
    }
    return true;
  }
}
