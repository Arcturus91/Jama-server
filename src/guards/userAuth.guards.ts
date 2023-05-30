import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class UserAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('session incoming from frontend', request.session);
    if (request.session.type !== 'user') {
      throw new UnauthorizedException(
        'Debes estar registrado como usuario para revisar la siguiente ruta.',
      );
    }
    return true;
  }
}
