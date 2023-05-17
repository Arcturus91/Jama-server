import { Chef } from 'src/chef/entities/chef.entity';
import { Order } from 'src/orders/entities/orders.entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('float')
  price: number;

  @Column('integer')
  availableAmount: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isAvailable: boolean;

  //agregar valoración de comida

  @Column({ nullable: true })
  mealStatus: string; //cooking, readyToBePickedUp

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //many meals have one single chef
  @ManyToOne(() => Chef, (chef) => chef.meals)
  chef: Chef;

  @OneToMany(() => Order, (order) => order.meal)
  orders: Order[];
}
