import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) { }
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    if (userId) {
      console.log('interceptor current user used');
      const user = await this.usersService.findUserById(userId);
      request.currentUser = user;
    }

    return handler.handle();
  }
}

//TODO: Pending to define whether keep this interceptor or not.