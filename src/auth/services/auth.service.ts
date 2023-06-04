import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    private jwtService: JwtService,
  ) { }

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

  async signup(email, password, type): Promise<any> {
    let entity: User | Chef;
    const hashedPassword = await this.hashPassword(password);
    if (type === UserType.USER) {
      const user = await this.usersService.registerUser(
        email,
        hashedPassword,
        type,
      );
      entity = user;
    } else if (type === UserType.CHEF) {
      const chef = await this.chefService.registerChef(
        email,
        hashedPassword,
        type,
      );
      entity = chef;
    }
    const data = await this.dataJwtSignedGenerator(entity);
    return data;
  }
  /*   Promise<User | Chef>  */
  async login(email, password, type): Promise<any> {
    let entity: User | Chef;
    if (type === UserType.USER) {
      const [user] = await this.usersService.findUser(email);
      if (!user) throw new NotFoundException('User not found');
      const isUser = await this.comparePasswords(password, user.password);
      if (!isUser) throw new BadRequestException('bad password');
      entity = user;
    } else if (type === UserType.CHEF) {
      const [chef] = await this.chefService.findChef(email);
      if (!chef) throw new NotFoundException('Chef not found');
      const isChef = await this.comparePasswords(password, chef.password);
      if (!isChef) throw new BadRequestException('bad password');
      entity = chef;
    }
    const data = await this.dataJwtSignedGenerator(entity);
    return data;
  }
  getCookieWithJwtToken(token) {
    const JWT_EXPIRATION_TIME = '3600';
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${JWT_EXPIRATION_TIME}`;
  }

  async dataJwtSignedGenerator(
    entity: User | Chef,
  ): Promise<{ entity: User | Chef; token: string }> {
    const payload = { id: entity.id, email: entity.email, type: entity.type };
    const token = this.jwtService.sign(payload);
    return { entity, token };
  }
}
