import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async signup(email, password): Promise<User> {
    const hashedPassword = await this.hashPassword(password);
    const user = await this.usersService.create(email, hashedPassword);
    return user;
  }

  async singin(email, password): Promise<User> {
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('User not found');

    const isUser = await this.comparePasswords(password, user.password);

    if (!isUser) throw new BadRequestException('bad password');
    return user;
  }
}
