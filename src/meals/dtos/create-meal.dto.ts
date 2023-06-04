import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateMealDto {
  @IsString()
  @Length(3, 30)
  name: string;

  @IsString()
  @IsOptional()
  @Length(0, 1000)
  description?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  availableAmount: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsUUID()
  @IsOptional()
  chefId?: string;
}

export class UpdateMealDto {
  @IsString()
  @Length(3, 30)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @Length(0, 1000)
  description?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsOptional()
  availableAmount?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsUUID()
  @IsOptional()
  chefId?: string;
}
