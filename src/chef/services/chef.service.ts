import { Injectable } from '@nestjs/common';
import { Chef } from '../entities/chef.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from 'src/meals/entities/meal.entity';

@Injectable()
export class ChefService {
  constructor(
    @InjectRepository(Chef) private chefRepo: Repository<Chef>,
    @InjectRepository(Meal) private mealRepo: Repository<Meal>,
  ) {}

  registerChef(email: string, password: string, type: string) {
    const chef = this.chefRepo.create({ email, password, type });
    return this.chefRepo.save(chef);
  }

  createMeal(name: string, price: number, availableAmount: number, chef) {
    const meal = this.mealRepo.create({ name, price, availableAmount, chef });
    return this.mealRepo.save(meal);
  }
  /* 
  updateMeal() {} */
}
