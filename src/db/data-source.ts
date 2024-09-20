import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
// eslint-disable-next-line import/named
import { DataSource, DataSourceOptions } from 'typeorm';

import { AppModule } from '../app.module';

import { DatabaseSeeder } from './seeds/seeder';

config();
console.log('Environment Variables:', {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
});

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  entities: ['./src/entities/*.entity.{ts,js}'],
  logging: true,
};

const dataSource: DataSource = new DataSource(options);

(async () => {
  console.log('Seeding data...');
  if (process.argv[2] === undefined) {
    console.log('Please enter the number of records to be created.');
    console.log('ex) npm run seed 10\n');
    process.exit(1);
  }

  const count = parseInt(process.argv[2], 10);

  try {
    await dataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (e) {
    console.error('Error during Data Source initialization:', e);
    process.exit(1);
  }

  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const seeder = app.get(DatabaseSeeder);
    await seeder.seed(count);
    console.log('Seeding completed:');
  } catch (e) {
    console.error('Error during seeding:', e);
    if (e.code === '23505') {
      console.error('\nSeeding data already exists.\n');
    }
  } finally {
    await dataSource.destroy();
  }
})();
