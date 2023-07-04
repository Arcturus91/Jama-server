/* eslint-disable prettier/prettier */
import {
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

export class UpdateChefDto {

    @IsString()
    @IsOptional()
    profileImageUrl: string;

    @IsString()
    @IsOptional()
    @Length(9, 9)
    phoneNumber: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    bio: string;

    @Length(4, 30)
    @IsString()
    @IsOptional()
    name: string;

}
