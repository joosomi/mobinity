import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';
import { GlobalExceptionsFilter } from './filter/global-exception.filter';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useGlobalFilters(new GlobalExceptionsFilter(logger));
  app.useLogger(logger);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 3000);

  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port ${port}`);
};

bootstrap();
