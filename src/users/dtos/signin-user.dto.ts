import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { UserType } from 'src/constants/constants';

export class SignInUserDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @Length(8, 30)
  password: string;

  @IsString()
  @IsOptional()
  profileImageUrl: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsEnum(UserType)
  type: string;
}
