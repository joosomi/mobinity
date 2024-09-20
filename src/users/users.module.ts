import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UserType } from '../entities/user-type.entity';
import { User } from '../entities/user.entity';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserType]), AuthModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
