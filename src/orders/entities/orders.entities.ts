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

  @Column({ type: 'float', name: 'total_price' })
  totalPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  //many orders to one user
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column()
  orderStatus: string; //! eventually implement enum for the following values requested, onCooking, onDelivery, completed

  //many orders can have one single meal.
  //each order can contain one single meal, otherwise many to many would be necessary
  @ManyToOne(() => Meal, (meal) => meal.orders)
  meal: Meal;
}
