import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentChef = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log('current chef decorator ', request.chef);
    return request.chef;
  },
);
