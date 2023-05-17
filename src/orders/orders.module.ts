import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from 'src/meals/entities/meal.entity';
import { Chef } from 'src/chef/entities/chef.entity';
import { Order } from './entities/orders.entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Meal, Chef, Order])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
