import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserType } from 'src/constants/constants';

export class CreateChefDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @Length(8, 30)
  password: string;

  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsNumber()
  @IsOptional()
  totalRatings?: number;

  @IsEnum(UserType)
  type: UserType;
}
