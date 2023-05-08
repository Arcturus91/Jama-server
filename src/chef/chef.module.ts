import { Module } from '@nestjs/common';
import { ChefController } from './controllers/chef.controller';
import { ChefService } from './services/chef.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chef } from './entities/chef.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chef])],
  controllers: [ChefController],
  providers: [ChefService],
})
export class ChefModule {}
