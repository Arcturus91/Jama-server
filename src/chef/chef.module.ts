import { Module } from '@nestjs/common';
import { ChefController } from './controllers/chef.controller';
import { ChefService } from './services/chef.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chef } from './entities/chef.entity';
import { Meal } from 'src/meals/entities/meal.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from 'src/auth/services/auth.service';
import { UsersService } from 'src/users/services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chef, Meal, User])],
  controllers: [ChefController],
  providers: [ChefService, AuthService, UsersService],
})
export class ChefModule {}
