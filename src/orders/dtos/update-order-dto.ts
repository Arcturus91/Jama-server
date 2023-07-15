import { IsEnum, IsString } from 'class-validator';
import { OrderStatus } from 'src/constants/constants';

export class UpdateOrderDto {
  @IsString()
  @IsEnum(OrderStatus)
  orderStatus: string;
}
