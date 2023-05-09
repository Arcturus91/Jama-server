import {
  Body,
  Controller,
  Post,
  Get,
  Session,
  BadRequestException,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { User } from '../entities/user.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller()
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/auth/signup/user')
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<Partial<User>> {
    const { email, password, type } = body;
    const user = await this.authService.signup(email, password, type);
    session.userId = user.id;
    return user;
  }

  @Post('/auth/signin/user')
  async signIn(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const { email, password } = body;
    const user = await this.authService.singin(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('/findusers')
  findUsers(@Session() session: any) {
    console.log(session.userId);
    if (!session.userId) throw new BadRequestException('not authorized');
    return this.usersService.findUsers();
  }

  @Get('/availableMeals')
  @UseGuards(AuthGuard)
  getAvailableMeals(@CurrentUser() user: User) {
    return user;
  }
}
