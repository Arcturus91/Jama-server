import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  Get,
  Param,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChefService } from '../services/chef.service';
import { CreateMealDto, UpdateMealDto } from 'src/meals/dtos/create-meal.dto';
import { Meal } from 'src/meals/entities/meal.entity';
import { CreateChefDto } from '../dtos/create-chef.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { Chef } from '../entities/chef.entity';

import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/jtw-auth.guard';
import { CurrentChef } from '../decorators/current-chef.decorator';
import { UpdateChefDto } from '../dtos/update-chef.dto';
import { validatePhoneNumber } from 'src/common/utils/validatePhoneNumber';
import { LogInChefDto } from '../dtos/login-chef.dto copy';

@Controller()
export class ChefController {
  constructor(
    private chefService: ChefService,
    private authService: AuthService,
  ) {}

  @Post('/auth/signup/chef')
  async createChef(
    @Body() body: CreateChefDto,
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

  @Post('/auth/login/chef')
  async login(@Body() body: LogInChefDto, @Res() res: Response): Promise<void> {
    const { email, password, type } = body;
    const { chef, token } = await this.authService.login(email, password, type);
    res.setHeader('Set-Cookie', this.authService.getCookieWithJwtToken(token));
    res.status(200).json(chef);
  }

  @Get('/chef/getallchef')
  async getAllChef(): Promise<Chef[]> {
    const chefs = await this.chefService.findAllChef();
    return chefs;
  }

  @Post('/chef/createmeal')
  @UseGuards(JwtAuthGuard)
  async createMeal(
    @CurrentChef() chef: Chef,
    @Body() body: any,
  ): Promise<Meal> {
    console.log('body', body);
    const meal = await this.chefService.createMeal(body, chef);
    return meal;
  }

  @Put('/chef/updatemeal/:id')
  @UseGuards(JwtAuthGuard)
  async updateMeal(
    @CurrentChef() chef: Chef,
    @Param('id') id: string,
    @Body() body: UpdateMealDto,
  ): Promise<Meal> {
    const meal = await this.chefService.updateMeal(id, body, chef);
    return meal;
  }

  @Get('/chef/getmeals')
  @UseGuards(JwtAuthGuard)
  async getChefMeals(@CurrentChef() chef: Chef): Promise<Meal[]> {
    const meals = await this.chefService.getChefMeals(chef);
    return meals;
  }

  @Get('/chef/:id')
  async getChefById(@Param('id') id: string): Promise<Chef> {
    const chef = await this.chefService.findChefById(id);
    return chef;
  }

  @Put('/chef/updatechef/:id')
  @UseGuards(JwtAuthGuard)
  async updateChefInfo(
    @CurrentChef() chef: Chef,
    @Param('id') id: string,
    @Body() body: UpdateChefDto,
  ): Promise<Chef> {
    console.log('body', body, id);
    const newChef = await this.chefService.updateChef(id, body, chef);
    return newChef;
  }

  //ruta para valorar al comenzal.

  //! crear ruta para valorar al chef.
}
