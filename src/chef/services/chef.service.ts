import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Chef } from '../entities/chef.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from 'src/meals/entities/meal.entity';
import { CreateMealDto } from 'src/meals/dtos/create-meal.dto';
import { UpdateChefDto } from '../dtos/update-chef.dto';
import { UpdateMealDto } from 'src/meals/dtos/update-meal.dto';

@Injectable()
export class ChefService {
  constructor(
    @InjectRepository(Chef) private chefRepo: Repository<Chef>,
    @InjectRepository(Meal) private mealRepo: Repository<Meal>,
  ) {}

  registerChef(
    email: string,
    password: string,
    type: string,
    address: string,
    phoneNumber: string,
  ) {
    const chef = this.chefRepo.create({
      email,
      password,
      type,
      address,
      phoneNumber,
    });
    if (chef) Logger.log('@registerChef - Chef registered');
    return this.chefRepo.save(chef);
  }

  async findChef(email: string) {
    return await this.chefRepo.find({
      where: { email },
      select: ['id', 'email', 'password', 'type'],
    });
  }

  async findAllChef() {
    return await this.chefRepo.find({
      select: [
        'id',
        'email',
        'type',
        'bio',
        'rating',
        'totalRatings',
        'address',
        'profileImageUrl',
      ],
    });
  }

  createMeal(body: CreateMealDto, chef: Chef) {
    const meal = this.mealRepo.create({ ...body, chef });
    if (meal) Logger.log('@createMeal - meal created');
    return this.mealRepo.save(meal);
  }

  async updateMeal(
    id: Meal['id'],
    updateMeal: UpdateMealDto,
    chef: Chef,
  ): Promise<Meal> {
    const { ...mealUpdates } = updateMeal;

    let meal = await this.mealRepo.findOne({
      where: { id },
      relations: ['chef'],
    });

    if (chef.id !== meal.chef.id) {
      throw new HttpException(
        'No eres el creador de este plato. No estás permitido de modificarlo',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!meal) {
      throw new NotFoundException(`Plato #${id} no encontrada`);
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

  findChefById(id: string) {
    return this.chefRepo.findOne({ where: { id }, relations: ['meals'] });
  }

  async updateChef(id: string, updateChef: UpdateChefDto, chef: Chef) {
    if (id !== chef.id) {
      throw new HttpException(
        'No estás permitido de modificar otro chef',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const { ...chefUpdate } = updateChef;
    let chefToModify = await this.chefRepo.findOne({ where: { id } });

    if (!chefToModify) {
      throw new NotFoundException(`Chef #${id} not encontrado`);
    }

    chefToModify = { ...chefToModify, ...chefUpdate };
    return this.chefRepo.save(chefToModify);
  }

  async implementRating(chef: Chef, userRatingToChef: number): Promise<void> {
    const { id, rating, totalRatings } = chef;

    if (rating === 0 || totalRatings === 0) {
      try {
        await this.chefRepo.update(id, {
          rating: userRatingToChef,
          totalRatings: 1,
        });
        Logger.log('@implementRating - Rating implemented');
      } catch (e) {
        throw new InternalServerErrorException(
          'Error implementing rating order',
          e.message,
        );
      }
      return;
    }
    const newTotalRatings = totalRatings + 1;
    const newRating = Number(
      ((rating + userRatingToChef) / newTotalRatings).toFixed(1),
    );
    try {
      await this.chefRepo.update(id, {
        rating: newRating,
        totalRatings: newTotalRatings,
      });

      Logger.log('@implementRating - Rating implemented');
    } catch (e) {
      throw new InternalServerErrorException(
        'Error implementing rating order',
        e.message,
      );
    }
  }
}
