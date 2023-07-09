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
  Patch,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { User } from '../entities/user.entity';
import { Meal } from 'src/meals/entities/meal.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { OrdersService } from 'src/orders/services/orders.service';
import { Order } from 'src/orders/entities/orders.entities';
import { MealsService } from 'src/meals/services/meals.service';
import { JwtAuthGuard } from 'src/guards/jtw-auth.guard';
import { Response } from 'express';
import { TwilioMessagingService } from 'src/twilio/twilio.service';
import { validatePhoneNumber } from 'src/common/utils/validatePhoneNumber';
import { LogInUserDto } from '../dtos/login-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { CurrentAdmin } from '../decorators/current-admin.decorator';

@Controller()
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private ordersService: OrdersService,
    private mealsService: MealsService,
    private twilioMessagingService: TwilioMessagingService,
  ) {}

  @Post('/auth/signup/user')
  async createUser(
    @Body() body: CreateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const { email, password, type, address, phoneNumber } = body;
    if (!validatePhoneNumber(phoneNumber)) {
      throw new HttpException(
        'El número de teléfono ingresado parece incorrecto',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { entity, token } = await this.authService.signup(
      email,
      password,
      type,
      address,
      phoneNumber,
    );
    res.setHeader('Set-Cookie', this.authService.getCookieWithJwtToken(token));

    res.status(200).json(entity);
  }

  @Post('/auth/login/user')
  async login(@Body() body: LogInUserDto, @Res() res: Response): Promise<void> {
    const { email, password, type } = body;
    const { entity, token } = await this.authService.login(
      email,
      password,
      type,
    );
    res.setHeader('Set-Cookie', this.authService.getCookieWithJwtToken(token));
    res.status(200).json(entity);
  }

  @Get('/availablemeals')
  getAvailableMeals(): Promise<Meal[]> {
    const availableMeals = this.usersService.getAvailableMeals();
    return availableMeals;
  }

  //!implement Guard: admin
  @Get('/user/getallusers')
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get('/availablemeals/:mealid')
  @UseGuards(JwtAuthGuard)
  async showMealDetail(@Param('mealid') mealid: string): Promise<Meal> {
    return this.usersService.showMealDetail(mealid);
  }

  @Post('/addmealorder')
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

    const { phoneNumber } = await this.usersService.findUserById(user.id);

    console.log('new order', newOrder, user, phoneNumber);
    await this.mealsService.updateMeal(mealId, +quantity);
    this.twilioMessagingService.sendSMS(
      user.id,
      newOrder.meal.name,
      phoneNumber,
    );
    console.log('NEW ORDER', newOrder);
    return newOrder;
    //session.orderId = newOrder.id;
    //!eventually, we will implement addMealToOrder(). But need to change Order entity relation with meals to Many to Many.
    //!implement notification for chef : nodemailer
    //!en el front, con la respuesta de este http response, el cliente recibe confirmación
    //!creería que se debe crear un servicio para notificar al chef y al admin. El admin tiene su guard. sería como un usuario pero con un guard especial
  }

  async putOrder() {
    //requires validation of payment
  }

  //delete a user
  @Delete('/deleteuser/:userid')
  async deleteUser(
    @Param('userid') userid: string,
  ): Promise<{ message: string }> {
    return this.usersService.deleteUser(userid);
  }

  @Get('/user/:userid')
  @UseGuards(JwtAuthGuard)
  async getUserDetail(@Param('userid') userid: string): Promise<User> {
    const user = await this.usersService.findUserById(userid);
    if (user.orders.length > 0) {
      const lastOrderId = user.orders[user.orders.length - 1].id;
      const getLastUserOrder = await this.ordersService.userLastOrder(
        lastOrderId,
      );
      user.orders[user.orders.length - 1] = getLastUserOrder;
      return user;
    }
    return user;
  }

  @Get('/user/lastorder/:userid')
  @UseGuards(JwtAuthGuard)
  async getLastUserOrder(@Param('userid') userid: string) {
    const user = await this.usersService.findUserById(userid);
    const lastOrderId = user.orders[user.orders.length - 1].id;
    const getLastUserOrder = this.ordersService.userLastOrder(lastOrderId);
    return getLastUserOrder;
  }

  @Patch('/user/updateuser/:userid')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('userid') userid: string,
    @CurrentUser() user: User,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    if (body.phoneNumber.length === 9) {
      if (!validatePhoneNumber(body.phoneNumber)) {
        throw new HttpException(
          'El número de teléfono ingresado parece incorrecto',
          HttpStatus.BAD_REQUEST,
        );
      }
      body.phoneNumber = '+51' + body.phoneNumber;
    }
    const updatedUser = await this.usersService.updateUser(userid, user, body);
    return updatedUser;
  }

  //necesito una ruta  de admin para definir un pedido como requested / onPreparation / ReadyToDeliver / Delivered
  //<-- Admin Routes -->
  @Get('/admin/updatemeal/allpendingmeals')
  @UseGuards(JwtAuthGuard)
  async updateMealStatus(@CurrentAdmin() admin: User) {
    console.log(admin);
  }
}
