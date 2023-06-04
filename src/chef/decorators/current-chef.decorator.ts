import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const CurrentChef = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!request.chef) {
      throw new UnauthorizedException(
        'Debes estar registrado como chef para revisar la siguiente ruta.',
      );
    }
    return request.chef;
  },
);
