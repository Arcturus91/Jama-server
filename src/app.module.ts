import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { MealsModule } from './meals/meals.module';
import { ChefModule } from './chef/chef.module';
import { OrdersModule } from './orders/orders.module';
import { Meal } from './meals/entities/meal.entity';
import { Order } from './orders/entities/orders.entities';
import { Chef } from './chef/entities/chef.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...(process.env.NODE_ENV === 'production'
        ? {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          entities: [User, Meal, Order, Chef],
          synchronize: true,
          retryDelay: 3000,
          retryAttempts: 10,
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
        }
        : {
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'jamaAdmin',
          password: '123456',
          database: 'jama_db',
          entities: [User, Meal, Order, Chef],
          synchronize: true,
          retryDelay: 3000,
          retryAttempts: 10,
        }),
    }),
    UsersModule,
    MealsModule,
    ChefModule,
    OrdersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
