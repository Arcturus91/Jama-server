import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Chef } from 'src/chef/entities/chef.entity';
import { ChefService } from 'src/chef/services/chef.service';
import { UserType } from 'src/constants/constants';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private chefService: ChefService,
  ) {}

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

  async signup(email, password, type): Promise<User | Chef> {
    const hashedPassword = await this.hashPassword(password);
    if (type === UserType.USER) {
      console.log('user creation');
      const user = await this.usersService.registerUser(
        email,
        hashedPassword,
        type,
      );
      return user;
    } else if (type === UserType.CHEF) {
      const chef = await this.chefService.registerChef(
        email,
        hashedPassword,
        type,
      );
      return chef;
    }
  }

  async singin(email, password): Promise<User> {
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('User not found');

    const isUser = await this.comparePasswords(password, user.password);

    if (!isUser) throw new BadRequestException('bad password');
    return user;
  }
}
