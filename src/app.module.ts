import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';

import { AuthModule } from './auth/auth.module';
import winstonConfig from './config/winston.config';
import DatabaseSeeder from './db/seeds/seeder';
import { Brand } from './entities/brand.entity';
import { DiscountDaysOfWeek } from './entities/discount-days-of-week.entity';
import { DiscountPolicy } from './entities/discount-policy.entity';
import { Product } from './entities/product.entity';
import { UserTypeProductPrice } from './entities/user-type-product-price.entity';
import { UserType } from './entities/user-type.entity';
import { User } from './entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // ConfigModule을 글로벌하게 사용하여 .env 파일 로드
    ConfigModule.forRoot({
      isGlobal: true, // 전역으로 설정
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: true, // 개발 환경에서만 true로 설정
        // dropSchema: true, // 매번 스키마를 삭제하고 새로 생성
        logging: true, // 개발환경에서만 true
      }),
    }),
    // FIXME: 테이블 생성을 위한 것으로 추후 삭제
    TypeOrmModule.forFeature([
      User,
      UserType,
      Product,
      Brand,
      UserTypeProductPrice,
      DiscountPolicy,
      DiscountDaysOfWeek,
    ]),
    WinstonModule.forRoot(winstonConfig),
    UsersModule,
    AuthModule,
  ],
  providers: [DatabaseSeeder],
})
export class AppModule {}
