import { Meal } from 'src/meals/entities/meal.entity';
import { Order } from 'src/orders/entities/orders.entities';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum UserType {
  USER = 'user',
  CHEF = 'chef',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: UserType })
  type: UserType;

  //one single user can have several orders
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
