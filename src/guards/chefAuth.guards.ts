import {
  CanActivate,
  ConsoleLogger,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class ChefAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('request from chef auth guard', request);
    if (request.session.type !== 'chef') {
      throw new UnauthorizedException(
        'Debes estar registrado como chef para revisar la siguiente ruta.',
      );
    }
    return true;
  }
}
