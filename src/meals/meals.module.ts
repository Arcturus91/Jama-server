import { Logger, Module } from '@nestjs/common';
import { MealsController } from './controllers/meals.controller';
import { MealsService } from './services/meals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './entities/meal.entity';
import { Chef } from 'src/chef/entities/chef.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from 'src/auth/services/auth.service';
import { UsersService } from 'src/users/services/users.service';
import { ChefService } from 'src/chef/services/chef.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meal, Chef, User])],
  controllers: [MealsController],
  providers: [MealsService, AuthService, UsersService, ChefService, Logger],
})
export class MealsModule {}
