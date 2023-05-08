import { Meal } from 'src/meals/entities/meal.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Chef extends User {
  @Column({ nullable: true })
  bio: string;

  @Column('float', { default: 0, nullable: true })
  rating: number;

  @Column({ default: 0, nullable: true })
  totalRatings: number;

  //one single chef can have many meals
  @OneToMany(() => Meal, (meal) => meal.chef)
  meals: Meal[];
}
