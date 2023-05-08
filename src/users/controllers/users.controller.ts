import {
  Body,
  Controller,
  Post,
  Get,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { User } from '../entities/user.entity';

@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    const { email, password } = body;
    const hashedPassword = await this.authService.hashPassword(password);
    return this.usersService.create(email, hashedPassword);
  }

  @Get('/findusers')
  findUsers() {
    return this.usersService.findUsers();
  }

  @Post('/signin')
  async signIn(@Body() body: CreateUserDto): Promise<User> {
    const { email, password } = body;

    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('User not found');

    const isUser = await this.authService.comparePasswords(
      password,
      user.password,
    );

    if (!isUser) throw new BadRequestException('bad password');

    return user;
  }
}
