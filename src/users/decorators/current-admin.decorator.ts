import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const CurrentAdmin = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!request.admin) {
      throw new UnauthorizedException(
        'Debes estar registrado como administrador para revisar la siguiente ruta.',
      );
    }
    return request.admin;
  },
);
