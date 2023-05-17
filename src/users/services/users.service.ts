import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Meal } from 'src/meals/entities/meal.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Meal) private mealRepo: Repository<Meal>,
  ) {}

  registerUser(email: string, password: string, type: string) {
    const user = this.userRepo.create({ email, password, type });
    return this.userRepo.save(user);
  }

  async findUsers() {
    const allUsers = await this.userRepo.find();
    return allUsers;
  }

  async find(email: string) {
    return await this.userRepo.find({
      where: { email },
      select: ['id', 'password', 'type'],
    });
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    return user;
  }

  async getAvailableMeals(address: string) {
    console.log(address);

    //! Código para encontrar las comidas cercanas al usuario en base a su dirección.

    const availableMeals = await this.mealRepo.find();
    return availableMeals;
  }

  async showMealDetail(mealId: string): Promise<Meal> {
    console.log(mealId);
    const selectedMeal = await this.mealRepo.findOne({ where: { id: mealId } });
    return selectedMeal;
  }

  //!Route: delete/ban user;
}
