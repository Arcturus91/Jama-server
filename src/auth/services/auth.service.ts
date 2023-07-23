import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Chef } from 'src/chef/entities/chef.entity';
import { ChefService } from 'src/chef/services/chef.service';
import { ChefType, UserType } from 'src/constants/constants';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private chefService: ChefService,
    private jwtService: JwtService,
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

  async signup(
    email: string,
    password: string,
    type: string,
    address: string,
    phoneNumber: string,
  ): Promise<any> {
    phoneNumber = '+51' + phoneNumber;
    let entity: User | Chef;
    const hashedPassword = await this.hashPassword(password);
    if (type === UserType.USER) {
      const user = await this.usersService.registerUser(
        email,
        hashedPassword,
        type,
        address,
        phoneNumber,
      );
      entity = user;
    } else if (type === ChefType.CHEF) {
      const chef = await this.chefService.registerChef(
        email,
        hashedPassword,
        type,
        address,
        phoneNumber,
      );
      entity = chef;
    }
    const data = await this.dataJwtSignedGenerator(entity);
    return data;
  }
  /*   Promise<User | Chef>  */
  async login(email: string, password: string, type: string): Promise<any> {
    let entity: User | Chef;
    if (type === UserType.USER) {
      const [user] = await this.usersService.findUser(email);
      if (!user) throw new NotFoundException('User not found');
      const isUser = await this.comparePasswords(password, user.password);
      if (!isUser) throw new UnauthorizedException('Contraseña incorrecta');
      entity = user;
    } else if (type === ChefType.CHEF) {
      const [chef] = await this.chefService.findChef(email);
      if (!chef) throw new NotFoundException('Chef not found');
      const isChef = await this.comparePasswords(password, chef.password);
      if (!isChef) throw new UnauthorizedException('Contraseña incorrecta');
      entity = chef;
    } else if (type === UserType.ADMIN) {
      const [admin] = await this.usersService.findUser(email);
      if (!admin) throw new NotFoundException('Admin no encontrado');
      const isAdmin = await this.comparePasswords(password, admin.password);
      if (!isAdmin) throw new UnauthorizedException('Contraseña incorrecta');
      entity = admin;
    }

    const data = await this.dataJwtSignedGenerator(entity);
    return data;
  }
  getCookieWithJwtToken(token: string) {
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
