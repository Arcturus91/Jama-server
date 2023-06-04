import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new UnauthorizedException(
        'Debes estar registrado como user para revisar la siguiente ruta.',
      );
    }
    return request.user;
  },
);
