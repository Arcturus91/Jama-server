import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class ChefAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.session.type !== 'chef') {
      throw new UnauthorizedException(
        'Debes estar registrado como chef para revisar la siguiente ruta.',
      );
    }
    return true;
  }
}
