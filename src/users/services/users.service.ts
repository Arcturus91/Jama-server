import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Meal } from 'src/meals/entities/meal.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Meal) private mealRepo: Repository<Meal>,
  ) { }

  registerUser(email: string, password: string, type: string) {
    const user = this.userRepo.create({ email, password, type });
    return this.userRepo.save(user);
  }

  async findUsers() {
    const allUsers = await this.userRepo.find();
    if (!allUsers) throw new NotFoundException('No hay usuarios registrados');
    return allUsers;
  }

  async findUser(email: string) {
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
    //!not found exeption tira un error 404, por cierto.
    const allMeals = await this.mealRepo.find();
    if (allMeals.length === 0) {
      throw new NotFoundException(
        'No hay comidas disponibles por el momento. Intente luego',
      );
    }
    const availableMeals = allMeals.filter((item) => item.isAvailable === true);
    return availableMeals;
  }

  async showMealDetail(mealId: string): Promise<Meal> {
    console.log(mealId);
    const selectedMeal = await this.mealRepo.findOne({ where: { id: mealId } });
    return selectedMeal;
  }

  //!Route: delete/ban user : needs modification in entity.

  async deleteUser(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepo.delete(id);
    return { message: 'User successfully deleted.' };
  }
}
