import {
  Body,
  Controller,
  Post,
  Get,
  Session,
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
import { SignInUserDto } from '../dtos/signin-user.dto';
import { UserAuthGuard } from 'src/guards/userAuth.guards';
import { OrdersService } from 'src/orders/services/orders.service';
import { Order } from 'src/orders/entities/orders.entities';
import { MealsService } from 'src/meals/services/meals.service';

@Controller()
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private ordersService: OrdersService,
    private mealsService: MealsService,
  ) {}

  @Post('/auth/signup/user')
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<Partial<User>> {
    const { email, password, type } = body;
    const user = await this.authService.signup(email, password, type);
    session.userId = user.id;
    session.type = user.type;
    return user;
  }

  @Post('/auth/signin/user')
  async signIn(
    @Body() body: SignInUserDto,
    @Session() session: any,
  ): Promise<Partial<User>> {
    const { email, password, type } = body;
    const user = await this.authService.signin(email, password, type);
    session.userId = user.id;
    session.type = user.type;
    return user;
  }

  @Post('/usersignout')
  signOut(@Session() session: any) {
    session.userId = null;
    session.type = null;
    session.orderId = null;
    return session;
  }

  //implement specific guard for user
  @Get('/availablemeals')
  @UseGuards(UserAuthGuard)
  getAvailableMeals(@CurrentUser() user: User): Promise<Meal[]> {
    const availableMeals = this.usersService.getAvailableMeals(user.address);
    return availableMeals;
  }

  //implement Guard: admin
  @Get('/findusers')
  @UseGuards(UserAuthGuard)
  findUsers(@Session() session: any): Promise<User[]> {
    console.log('session desde find users', session);
    return this.usersService.findUsers();
  }

  @Get('/availableMeals/:mealid')
  @UseGuards(UserAuthGuard)
  async showMealDetail(@Param('mealid') mealid: string): Promise<Meal> {
    return this.usersService.showMealDetail(mealid);
  }

  @Post('/addmealorder')
  @UseGuards(UserAuthGuard)
  async mealToOrder(
    @Body() body: any,
    @Session() session: any,
    @CurrentUser() user: User,
  ): Promise<Order> {
    const { mealId, quantity } = body;
    const isMealValid = await this.mealsService.validateMealRequest(
      mealId,
      quantity,
    );
    if (!isMealValid) return;
    if (session.orderId) {
      const updatedOrder = await this.ordersService.updateOrder(
        mealId,
        +quantity,
        session.orderId,
      );
      await this.mealsService.updateMeal(mealId, +quantity);
      //!implement notification for chef : nodemailer
      //!en el front, con la respuesta de este http response, el cliente recibe confirmación
      //!creería que se debe crear un servicio para notificar al chef y al admin. El admin tiene su guard. sería como un usuario pero con un guard especial

      return updatedOrder;
      //!eventually, we will implement addMealToOrder(). But need to change Order entity relation with meals to Many to Many.
    } else {
      const newOrder = await this.ordersService.createOrderMeal(
        user,
        mealId,
        +quantity,
      );
      await this.mealsService.updateMeal(mealId, +quantity);
      session.orderId = newOrder.id;
      return newOrder;
    }
  }

  async putOrder() {
    //requires validation of payment
  }
}
