import { Module } from '@nestjs/common';
import { MealsController } from './controllers/meals.controller';
import { MealsService } from './services/meals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './entities/meal.entity';
import { Chef } from 'src/chef/entities/chef.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meal, Chef, User])],
  controllers: [MealsController],
  providers: [MealsService],
})
export class MealsModule {}
