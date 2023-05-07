import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'jamaAdmin',
      password: '123456',
      database: 'jama_db',
      entities: [User],
      synchronize: true,
      retryDelay: 3000,
      retryAttempts: 10,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
