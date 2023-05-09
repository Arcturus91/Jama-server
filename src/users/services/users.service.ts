import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  registerUser(email: string, password: string, type: string) {
    const user = this.userRepo.create({ email, password, type });
    return this.userRepo.save(user);
  }

  async findUsers() {
    const allUsers = await this.userRepo.find();
    return allUsers;
  }

  async find(email: string) {
    return await this.userRepo.find({ where: { email } });
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    return user;
  }
}
