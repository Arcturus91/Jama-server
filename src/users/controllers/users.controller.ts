import {
  Body,
  Controller,
  Post,
  Get,
  Session,
  BadRequestException,
  UseInterceptors,
  UseGuards,
  Param,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { User } from '../entities/user.entity';
import { Meal } from 'src/meals/entities/meal.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { AuthGuard } from 'src/guards/auth.guards';
import { SignInUserDto } from '../dtos/signin-user.dto copy';

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
    @Body() body: SignInUserDto,
    @Session() session: any,
  ): Promise<User> {
    const { email, password } = body;
    console.log(email, password);
    const user = await this.authService.signin(email, password);
    session.userId = user.id;
    session.type = user.type;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  //implement specific guard for user
  @Get('/availableMeals')
  @UseGuards(AuthGuard)
  getAvailableMeals(@CurrentUser() user: User): Promise<Meal[]> {
    const availableMeals = this.usersService.getAvailableMeals(user.address);
    return availableMeals;
  }

  //implement Guard: admin
  @Get('/findusers')
  findUsers(@Session() session: any): Promise<User[]> {
    console.log(session.userId);
    if (!session.userId) throw new BadRequestException('not authorized');
    return this.usersService.findUsers();
  }

  @Get('/availableMeals/:mealid')
  @UseGuards(AuthGuard)
  async showMealDetail(@Param('mealid') mealid: string): Promise<Meal> {
    console.log('mealid en controller ', mealid);
    return this.usersService.showMealDetail(mealid);
  }

  async mealToOrder() {
    //diria que a la sesión se le mete el order id.
  }

  async putOrder() {
    //requires validation of payment
  }
}
