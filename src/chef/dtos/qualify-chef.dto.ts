import { IsNumber, IsPositive, IsString } from 'class-validator';

export class QualifyChefDto {
  @IsString()
  orderId: string;
  @IsString()
  mealId: string;

  @IsNumber()
  @IsPositive()
  userRatingToChef: number;
}
