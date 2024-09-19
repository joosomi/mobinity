import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserType } from '../entities/user-type.entity';
import { User } from '../entities/user.entity';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserType])], // UserRepository를 제공하는 모듈 등록

  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
