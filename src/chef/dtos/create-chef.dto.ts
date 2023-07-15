import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ChefType } from 'src/constants/constants';

export class CreateChefDto {
  @IsEmail()
  @IsString()
  email: string;

  @Length(4, 30)
  @IsString()
  name: string;

  @IsString()
  @Length(8, 30)
  password: string;

  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsEnum(ChefType)
  @IsString()
  type: string;
}
