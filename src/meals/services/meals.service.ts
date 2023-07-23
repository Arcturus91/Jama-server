import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal } from '../entities/meal.entity';
import { Repository } from 'typeorm';
import { Chef } from 'src/chef/entities/chef.entity';

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

    if (!availableAmount || !isAvailable) {
      throw new BadRequestException('Plato no disponible / no encontrado');
    }

    if (availableAmount > quantity) {
      availableAmount = availableAmount - quantity;
    } else {
      availableAmount = 0;
      isAvailable = false;
    }

    const dataToUpdate = { availableAmount, isAvailable };
    try {
      await this.mealRepo.update(mealId, dataToUpdate);
    } catch (e) {
      throw new InternalServerErrorException(
        'Error al actualizar el platillo',
        e.message,
      );
    }
  }

  async deleteMeal(mealId: string, chef: Chef): Promise<void> {
    const mealToDelete = await this.mealRepo.findOne({
      where: { id: mealId },
      relations: ['chef'],
    });
    if (!mealToDelete) {
      throw new NotFoundException({ message: 'No se encontró el platillo' });
    } else {
      if (mealToDelete.chef.id !== chef.id) {
        throw new HttpException(
          'No estás autorizado para borrar este platillo',
          HttpStatus.UNAUTHORIZED,
        );
      }
      try {
        await this.mealRepo.delete(mealToDelete.id);
      } catch (e) {
        //!add handler for typeorm constraint delete error.
        //!it has to be shown to chef.
        throw new InternalServerErrorException(
          'Error deleting meal',
          e.message,
        );
      }
    }
  }

  async getMealChef(mealId: string) {
    const meal = await this.mealRepo.findOne({
      where: { id: mealId },
      relations: ['chef'],
    });

    if (meal.id !== mealId) {
      throw new HttpException(
        'No se encuentra este platillo',
        HttpStatus.NOT_FOUND,
      );
    }
    return meal.chef;
  }
}
