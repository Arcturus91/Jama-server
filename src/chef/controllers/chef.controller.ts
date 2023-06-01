import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  Get,
  Delete,
} from '@nestjs/common';
import { ChefService } from '../services/chef.service';
import { CreateMealDto } from 'src/meals/dtos/create-meal.dto';
import { Meal } from 'src/meals/entities/meal.entity';
import { CreateChefDto } from '../dtos/create-chef.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { Chef } from '../entities/chef.entity';
import { ChefAuthGuard } from 'src/guards/chefAuth.guards';
import { SignInChefDto } from '../dtos/signin-chef.dto';
import { Response } from 'express';

@Controller()
export class ChefController {
  constructor(
    private chefService: ChefService,
    private authService: AuthService,
  ) { }

  @Post('/auth/signup/chef')
  async createChef(
    @Body() body: CreateChefDto,
    @Res() res: Response,
  ): Promise<void> {
    const { email, password, type } = body;
    const { chef, token } = await this.authService.signup(
      email,
      password,
      type,
    );
    res.setHeader('Set-Cookie', this.authService.getCookieWithJwtToken(token));
    res.status(200).json(chef);
  }

  @Post('/auth/login/chef')
  async login(
    @Body() body: SignInChefDto,
    @Res() res: Response,
  ): Promise<void> {
    const { email, password, type } = body;
    const { chef, token } = await this.authService.login(email, password, type);
    res.setHeader('Set-Cookie', this.authService.getCookieWithJwtToken(token));
    res.status(200).json(chef);
  }

  @Post('/auth/logout')
  signOut() {
    console.log('logout request');
  }

  /*   @Post('/chef/createmeal')
    @UseGuards(ChefAuthGuard)
    async createMeal(
      @Body() body: CreateMealDto,
    ): Promise<Meal> {
  
      const meal = await this.chefService.createMeal(
        body.name,
        body.price,
        body.availableAmount,
  
      );
      return meal;
    } */

  //UPDATE MEALS

  //ruta para valorar al comenzal.
}
