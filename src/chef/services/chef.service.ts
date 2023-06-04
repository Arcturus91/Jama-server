import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Chef } from '../entities/chef.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from 'src/meals/entities/meal.entity';
import { UpdateMealDto } from 'src/meals/dtos/create-meal.dto';

@Injectable()
export class ChefService {
  constructor(
    @InjectRepository(Chef) private chefRepo: Repository<Chef>,
    @InjectRepository(Meal) private mealRepo: Repository<Meal>,
  ) { }

  registerChef(email: string, password: string, type: string) {
    const chef = this.chefRepo.create({ email, password, type });
    if (chef) Logger.log('@registerChef - Chef registered');
    return this.chefRepo.save(chef);
  }

  async findChef(email: string) {
    return await this.chefRepo.find({
      where: { email },
      select: ['id', 'password', 'type'],
    });
  }

  createMeal(name: string, price: number, availableAmount: number, chef) {
    const meal = this.mealRepo.create({ name, price, availableAmount, chef });
    if (meal) Logger.log('@createMeal - meal created');
    return this.mealRepo.save(meal);
  }

  async updateMeal(id, updateMealDto: UpdateMealDto): Promise<Meal> {
    const { ...mealUpdates } = updateMealDto;

    let meal = await this.mealRepo.findOne({ where: { id } });

    if (!meal) {
      throw new NotFoundException(`Comida #${id} not encontrada`);
    }

    meal = { ...meal, ...mealUpdates };
    if (meal) Logger.log('@updateMeal - meal updated');
    return this.mealRepo.save(meal);
  }

  async getChefMeals(chef: Chef) {
    const chefMeals = await this.mealRepo.find({ where: { chef } });

    if (chefMeals.length === 0) {
      Logger.warn('@getChefMeals - Chef hasnt created meals yet');
      throw new NotFoundException('No has creado comidas aún, chef.');
    }
    return chefMeals;
  }
}
