import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { UserType } from 'src/constants/constants';

export class CreateUserDto {
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
  phoneNumber: string;

  @IsEnum(UserType)
  type;

  @IsString()
  address: string;
}
