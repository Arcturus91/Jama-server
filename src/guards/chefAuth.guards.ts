import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class ChefAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.session.type !== 'chef') {
      throw new UnauthorizedException('You must be chef to access this route');
    }
    return true;
  }
}
