import { Logger, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { ChefService } from 'src/chef/services/chef.service';
import { UsersService } from 'src/users/services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Chef } from 'src/chef/entities/chef.entity';
import { Meal } from 'src/meals/entities/meal.entity';
import { Order } from 'src/orders/entities/orders.entities';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Chef, Meal, Order]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '20h' },
    }),
  ],
  providers: [
    ChefService,
    AuthService,
    UsersService,
    JwtStrategy,
    Logger,
    ConfigService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
