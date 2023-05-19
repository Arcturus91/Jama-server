import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal } from '../entities/meal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MealsService {
  constructor(@InjectRepository(Meal) private mealRepo: Repository<Meal>) {}

  async validateMealRequest(
    mealId: string,
    quantity: number,
  ): Promise<boolean> {
    const meal = await this.mealRepo.findOne({ where: { id: mealId } });

    if (!meal) {
      throw new BadRequestException('mealId no encontrado');
    }
    if (meal.availableAmount < quantity) {
      throw new BadRequestException(
        'No hay suficientes platos para este pedido',
      );
    }
    return true;
  }

  async updateMeal(mealId: string, quantity: number): Promise<void> {
    let { availableAmount, isAvailable } = await this.mealRepo.findOne({
      where: { id: mealId },
    });
    if (availableAmount > quantity) {
      availableAmount = availableAmount - quantity;
    } else {
      availableAmount = 0;
      isAvailable = false;
    }

    const dataToUpdate = { availableAmount, isAvailable };
    await this.mealRepo.update(mealId, dataToUpdate);
  }
}
