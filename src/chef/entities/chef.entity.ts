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

  @Column({ nullable: true })
  name: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true, name: 'profile_image_url' })
  profileImageUrl: string;

  @Column({ nullable: true, name: 'phone_number' })
  phoneNumber: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ nullable: true })
  bio: string;

  @Column('float', { default: 0, nullable: true })
  rating: number;

  @Column({ default: 0, nullable: true, name: 'total_ratings' })
  totalRatings: number;

  @Column({ default: '' })
  address: string;

  @Column()
  type: string;
  //!Aqui se puede colocar un enum pero meterse con la DB ya desplegada es migraciones. Para luego.
  /* Idealmente:
  @Column({
    type:'enum',
    enum: ChefType
    default: ChefType.Chef,
    nullable:false,
    name:type
  }) */

  //one single chef can have many meals
  @OneToMany(() => Meal, (meal) => meal.chef)
  meals: Meal[];
}
