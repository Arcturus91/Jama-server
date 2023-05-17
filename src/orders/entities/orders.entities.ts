import { Meal } from 'src/meals/entities/meal.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //many orders to one user
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column()
  orderStatus: string; // onSelection, required, onCooking, onDelivery, completed

  //many orders can have one single meal.
  //each order can contain one single meal, otherwise many to many would be necessary
  @ManyToOne(() => Meal, (meal) => meal.orders)
  meal: Meal;
}
