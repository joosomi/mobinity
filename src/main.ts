import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';
import { GlobalExceptionsFilter } from './filter/global-exception.filter';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  // Swagger 설정 (API 문서화)
  const config = new DocumentBuilder()
    .setTitle('mobinity API 명세서') // 자원 서버 관련 제목
    .setDescription('mobinity 서버의 API 명세서 입니다.')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useGlobalFilters(new GlobalExceptionsFilter(logger));
  app.useLogger(logger);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 3000);

  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port ${port}`);
};

bootstrap();
