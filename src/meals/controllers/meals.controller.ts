import { Controller, Delete, Param, Res, UseGuards } from '@nestjs/common';
import { MealsService } from '../services/meals.service';
import { JwtAuthGuard } from 'src/guards/jtw-auth.guard';
import { Response } from 'express';
import { Chef } from 'src/chef/entities/chef.entity';
import { CurrentChef } from 'src/chef/decorators/current-chef.decorator';

@Controller()
export class MealsController {
  constructor(private mealsService: MealsService) {}

  @Delete('/chef/deletemeal/:mealid')
  @UseGuards(JwtAuthGuard)
  async deleteMeal(
    @CurrentChef() chef: Chef,
    @Param('mealid') mealid: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.mealsService.deleteMeal(mealid, chef);
    res.status(200).send({ message: 'Platillo eliminado satisfactoriamente' });
  }
  //! you can only delete a meal from the chef that created the meal
}
