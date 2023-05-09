import { UserType } from 'src/constants/constants';
import { Meal } from 'src/meals/entities/meal.entity';
import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Chef {
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

  @Column({ nullable: true })
  bio: string;

  @Column('float', { default: 0, nullable: true })
  rating: number;

  @Column({ default: 0, nullable: true })
  totalRatings: number;

  @Column({ default: '' })
  address: string;

  @Column()
  type: string;

  //one single chef can have many meals
  @OneToMany(() => Meal, (meal) => meal.chef)
  meals: Meal[];
}
