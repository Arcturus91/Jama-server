import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Meal } from 'src/meals/entities/meal.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Order } from 'src/orders/entities/orders.entities';
import { OrderStatus } from 'src/constants/constants';
/* import { sendWsp } from 'src/common/utils/twilio'; */

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Meal) private mealRepo: Repository<Meal>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) {}

  async registerUser(
    email: string,
    password: string,
    type: string,
    address: string,
    phoneNumber: string,
  ) {
    const user = this.userRepo.create({
      email,
      password,
      type,
      address,
      phoneNumber,
    });
    try {
      if (user) Logger.log('@registerUser - User created successfully');
      return await this.userRepo.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUsers() {
    const allUsers = await this.userRepo.find();
    if (!allUsers) throw new NotFoundException('No hay usuarios registrados');
    return allUsers;
  }

  async findUser(email: string) {
    return await this.userRepo.find({
      where: { email },
      select: ['id', 'email', 'password', 'type'],
    });
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (user) Logger.log('@findOne - User found');
    return user;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['orders'],
    });
    if (!user) throw new NotFoundException('Usuario no registrado');
    return user;
  }

  async getAvailableMeals() {
    //TODO:Código para encontrar las comidas cercanas al usuario en base a su dirección.
    const allMeals = await this.mealRepo.find();
    if (allMeals.length === 0) {
      Logger.warn('@getAvailableMeals - No meals available at the moment');
      throw new NotFoundException(
        'No hay comidas disponibles por el momento. Intente luego',
      );
    }
    const availableMeals = allMeals.filter((item) => item.isAvailable === true);

    return availableMeals;
  }

  async showMealDetail(mealId: string): Promise<Meal> {
    const selectedMeal = await this.mealRepo.findOne({
      where: { id: mealId },
      relations: ['chef'],
    });
    return selectedMeal;
  }

  //!Route: delete/ban user : needs modification in entity because of constrains

  async deleteUser(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepo.delete(id);
    return { message: 'User successfully deleted.' };
  }

  async updateUser(
    id: User['id'],
    user: User,
    updateUser: UpdateUserDto,
  ): Promise<User> {
    const prevUserData = await this.userRepo.findOne({ where: { id } });

    if (!prevUserData) {
      throw new NotFoundException(`Usuario #${id} no encontrado`);
    }

    if (user.id !== prevUserData.id) {
      throw new HttpException(
        ' No estás permitido de modificar otro usuario',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { ...userUpdates } = updateUser;
    const updatedUser = { ...prevUserData, ...userUpdates };

    if (updatedUser) Logger.log('@updateUser - user updated');

    return this.userRepo.save(updatedUser);
  }

  async getAllPendingOrders(admin: User): Promise<Order[]> {
    if (admin.type !== 'admin') {
      throw new HttpException(
        'Solo un administrador puede ver esta información',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.orderRepo.find({
      where: [
        { orderStatus: OrderStatus.requested },
        { orderStatus: OrderStatus.onCooking },
        { orderStatus: OrderStatus.onDelivery },
      ],
      relations: ['meal', 'user'],
    });
  }
}
