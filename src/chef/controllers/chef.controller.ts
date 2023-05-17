import {
  Body,
  Controller,
  Inject,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ChefService } from '../services/chef.service';
import { CreateMealDto } from 'src/meals/dtos/create-meal.dto';
import { Meal } from 'src/meals/entities/meal.entity';
import { CreateChefDto } from '../dtos/create-chef.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { Chef } from '../entities/chef.entity';
import { ChefAuthGuard } from 'src/guards/chefAuth.guards';
import { SignInChefDto } from '../dtos/signin-chef.dto';

@Controller()
export class ChefController {
  constructor(
    private chefService: ChefService,
    private authService: AuthService,
  ) {}

  @Post('/auth/signup/chef')
  async createChef(
    @Body() body: CreateChefDto,
    @Session() session: any,
  ): Promise<Partial<Chef>> {
    const { email, password, type } = body;
    const chef = await this.authService.signup(email, password, type);
    session.chefId = chef.id;
    session.type = chef.type;
    return chef;
  }

  @Post('/auth/signin/chef')
  async signIn(
    @Body() body: SignInChefDto,
    @Session() session: any,
  ): Promise<Partial<Chef>> {
    const { email, password, type } = body;
    console.log(email, password);
    const chef = await this.authService.signin(email, password, type);
    session.chefId = chef.id;
    session.type = chef.type;
    return chef;
  }

  @Post('/chefsignout')
  signOut(@Session() session: any) {
    session.type = null;
    session.chefId = null;
    return session;
  }

  @Post('/chef/createmeal')
  @UseGuards(ChefAuthGuard)
  async createMeal(
    @Body() body: CreateMealDto,
    @Session() session: any,
  ): Promise<Meal> {
    console.log('session en create meal', session);
    const meal = await this.chefService.createMeal(
      body.name,
      body.price,
      body.availableAmount,
      session.chefId,
    );
    return meal;
  }

  //UPDATE MEALS

  //ruta para valorar al comenzal.
}
