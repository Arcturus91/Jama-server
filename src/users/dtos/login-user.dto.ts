import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { UserType } from 'src/constants/constants';

export class LogInUserDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @Length(8, 30)
  password: string;

  @IsEnum(UserType)
  type: string;
}
