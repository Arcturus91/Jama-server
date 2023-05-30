import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal } from 'src/meals/entities/meal.entity';
import { Repository } from 'typeorm';
import { Order } from '../entities/orders.entities';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Meal) private mealRepo: Repository<Meal>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) { }

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
    // And thats why you need to do the findOne method: to get udpated status of meal.
    //!to create an order or update an order should trigger some alert/message to chef and admin.
    console.log(orderedMeal);
    const totalPrice = orderedMeal.price * quantity;
    const orderStatus = 'onSelection';
    const newOrder = this.orderRepo.create({
      totalPrice,
      user,
      orderStatus,
      meal: orderedMeal,
    });
    console.log('meal added to order', newOrder);
    return this.orderRepo.save(newOrder);
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
