import { UserType } from 'src/constants/constants';
import { Order } from 'src/orders/entities/orders.entities';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true, name: 'profile_image_url' })
  profileImageUrl: string;

  @Column({ nullable: true, name: 'phone_number' })
  phoneNumber: string;
  //!remove all nullable true de los elementos que no pueden ser nullable como el phonenumber
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: '' })
  address: string;

  @Column()
  type: string;
  //!Aqui se puede colocar un enum pero meterse con la DB ya desplegada es migraciones. Para luego.
  /* Idealmente:
  @Column({
    type:'enum',
    enum: UserType
    default: UserType.User,
    nullable:false,
    name:type
  }) */

  //one single user can have several orders
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
