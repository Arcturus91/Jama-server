import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal } from 'src/meals/entities/meal.entity';
import { Repository } from 'typeorm';
import { Order } from '../entities/orders.entities';
import { User } from 'src/users/entities/user.entity';
import { OrderStatus } from 'src/constants/constants';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Meal) private mealRepo: Repository<Meal>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) {}

  async updateOrder(
    mealId: string,
    quantity: number,
    orderId: string,
  ): Promise<Order> {
    const previousOrder = await this.orderRepo.findOne({
      where: { id: orderId },
    });
    const orderedMeal = await this.mealRepo.findOne({ where: { id: mealId } });
    const totalPrice = previousOrder.totalPrice + quantity * orderedMeal.price;
    await this.orderRepo.update(orderId, { totalPrice });
    const updatedOrder = await this.orderRepo.findOne({
      where: { id: orderId },
    });
    return updatedOrder;
  }

  async createOrderMeal(
    user: User,
    mealId: string,
    quantity: number,
  ): Promise<Order> {
    const orderedMeal = await this.mealRepo.findOne({ where: { id: mealId } });
    if (!orderedMeal) {
      throw new BadRequestException('plato no encontrado');
    }

    if (orderedMeal.availableAmount < 1) {
      throw new BadRequestException('Platillo ya no disponible');
    }

    const totalPrice = orderedMeal.price * quantity;
    const orderStatus = OrderStatus.requested;
    const newOrder = this.orderRepo.create({
      totalPrice,
      user,
      orderStatus,
      meal: orderedMeal,
    });
    try {
      const savedOrder = await this.orderRepo.save(newOrder);
      const completeOrder = await this.orderRepo.findOne({
        where: { id: savedOrder.id },
        relations: ['meal'],
      });
      return completeOrder;
    } catch (e) {
      throw new InternalServerErrorException('Error creating order', e.message);
    }
  }

  async getAllOrders(): Promise<Order[]> {
    const allOrders = await this.orderRepo.find({
      relations: ['user', 'meal'],
    });
    return allOrders;
  }
}

/*   async addMealToOrder(
        user: User,
        mealId: string,
        quantity: number,
        orderId: any,
      ) {
        const orderedMeal = await this.mealRepo.findOne({ where: { id: mealId } });
        const previousOrder = await this.orderRepo.findOne({
          where: { id: orderId },
        });
    
        const updatedOrder = await this.orderRepo.update(orderId,{})
      } */
