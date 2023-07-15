import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { ChefType } from 'src/constants/constants';

export class LogInChefDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @Length(8, 30)
  password: string;

  @IsEnum(ChefType)
  type: string;
}
