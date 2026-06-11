import 'dotenv/config';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),

  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  synchronize: false,

  // logging: true,

  entities: ['src/modules/**/infra/typeorm/entities/*.ts'],

  migrations: ['src/modules/**/infra/typeorm/migrations/*.ts'],
});

export default AppDataSource;