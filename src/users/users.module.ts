import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { AuthService } from 'src/auth/services/auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { Order } from 'src/orders/entities/orders.entities';
import { Meal } from 'src/meals/entities/meal.entity';
import { ChefService } from 'src/chef/services/chef.service';
import { Chef } from 'src/chef/entities/chef.entity';
import { OrdersService } from 'src/orders/services/orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Order, Meal, Chef])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    ChefService,
    CurrentUserInterceptor,
    OrdersService,
  ],
})
export class UsersModule {}
