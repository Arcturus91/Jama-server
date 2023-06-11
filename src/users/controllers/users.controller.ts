import {
  Body,
  Controller,
  Post,
  Get,
  UseInterceptors,
  UseGuards,
  Param,
  Res,
  Delete,
  HttpStatus,
  HttpException,
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
import { JwtAuthGuard } from 'src/guards/jtw-auth.guard';
import { Response } from 'express';

@Controller()
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private ordersService: OrdersService,
    private mealsService: MealsService,
  ) { }

  @Post('/auth/signup/user')
  async createUser(
    @Body() body: CreateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const { email, password, type } = body;
    const { entity, token } = await this.authService.signup(
      email,
      password,
      type,
    );
    res.setHeader('Set-Cookie', this.authService.getCookieWithJwtToken(token));

    res.status(200).json(entity);
  }

  @Post('/auth/login/user')
  async login(
    @Body() body: SignInUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const { email, password, type } = body;
    const { entity, token } = await this.authService.login(email, password, type);
    res.setHeader('Set-Cookie', this.authService.getCookieWithJwtToken(token));
    res.status(200).json(entity);
  }


  @Get('/availablemeals')
  getAvailableMeals(): Promise<Meal[]> {
    const availableMeals = this.usersService.getAvailableMeals();
    return availableMeals;
  }

  //implement Guard: admin
  @Get('/admin/findusers')
  @UseGuards(JwtAuthGuard)
  findUsers(): Promise<User[]> {
    return this.usersService.findUsers();
  }

  @Get('/availablemeals/:mealid')
  @UseGuards(JwtAuthGuard)
  async showMealDetail(@Param('mealid') mealid: string): Promise<Meal> {
    return this.usersService.showMealDetail(mealid);
  }

  @Post('/user/addmealorder')
  @UseGuards(JwtAuthGuard)
  async mealToOrder(
    @Body() body: any,
    @CurrentUser() user: User,
  ): Promise<Order> {
    const { mealId, quantity } = body;

    const isMealValid = await this.mealsService.validateMealRequest(
      mealId,
      quantity,
    );

    if (!isMealValid) {
      throw new HttpException('Invalid meal request', HttpStatus.BAD_REQUEST);
    }

    const newOrder = await this.ordersService.createOrderMeal(
      user,
      mealId,
      +quantity,
    );

    await this.mealsService.updateMeal(mealId, +quantity);

    return newOrder;
    //!eventually, we will implement addMealToOrder(). But need to change Order entity relation with meals to Many to Many.
    //!creería que se debe crear un servicio para notificar al chef y al admin. El admin tiene su guard. sería como un usuario pero con un guard especial
  }

  async putOrder() {
    //requires validation of payment
  }

  //delete a user
  @Delete('/deleteuser/:userid')
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @Param('userid') userid: string,
  ): Promise<{ message: string }> {
    return this.usersService.deleteUser(userid);
  }


  @Get('/user/:userid')
  @UseGuards(JwtAuthGuard)
  async getUserDetail(@Param('userid') userid: string): Promise<User> {
    const user = this.usersService.findUserById(userid);
    return user;
  }
}
/*     if (session.orderId) {
      const updatedOrder = await this.ordersService.updateOrder(
        mealId,
        +quantity,
        session.orderId,
      );
      await this.mealsService.updateMeal(mealId, +quantity);
      return updatedOrder;
    } else { */

