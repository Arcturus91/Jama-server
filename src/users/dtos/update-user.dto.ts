import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  profileImageUrl: string;

  @IsOptional()
  @IsString()
  @Length(9, 9)
  phoneNumber: string;

  @IsOptional()
  @IsString()
  address: string;
}
