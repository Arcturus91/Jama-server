import {
  Body,
  Controller,
  Post,
  Get,
  Session,
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
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const { email, password } = body;
    const hashedPassword = await this.authService.hashPassword(password);
    const user = await this.usersService.create(email, hashedPassword);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signIn(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const { email, password } = body;

    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('User not found');

    const isUser = await this.authService.comparePasswords(
      password,
      user.password,
    );

    if (!isUser) throw new BadRequestException('bad password');

    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('/findusers')
  findUsers(@Session() session: any) {
    console.log(session.userId);
    if (!session.userId) throw new BadRequestException('not authorized');
    return this.usersService.findUsers();
  }
}
