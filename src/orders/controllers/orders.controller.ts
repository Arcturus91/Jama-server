import { Controller, Get } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { Order } from '../entities/orders.entities';

@Controller()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}
  //!Admin guard
  @Get('/admin/getallorders')
  async getAllOrders(): Promise<Order[]> {
    const allOrders = await this.ordersService.getAllOrders();
    return allOrders;
  }
}
