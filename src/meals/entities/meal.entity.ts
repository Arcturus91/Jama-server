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

  @Column({ type: 'integer', name: 'available_amount' })
  availableAmount: number;

  @Column({ nullable: true, name: 'image_url' })
  imageUrl: string;

  @Column({ default: true, name: 'is_available' })
  isAvailable: boolean;

  //!agregar valoración de comida

  @Column({ nullable: true, name: 'meal_status' })
  mealStatus: string; //cooking, readyToBePickedUp

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  //many meals have one single chef
  @ManyToOne(() => Chef, (chef) => chef.meals)
  chef: Chef;

  @OneToMany(() => Order, (order) => order.meal)
  orders: Order[];
}
