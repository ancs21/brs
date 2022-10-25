import { DataSource } from 'typeorm';
import configuration from './src/config/configuration';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configuration().database.host,
  port: configuration().database.port,
  username: configuration().database.username,
  password: configuration().database.password,
  database: configuration().database.database,
  entities: ['dist/**/*.entity.js'],
  logging: true,
  synchronize: false,
  migrationsRun: false,
  migrations: ['dist/**/migrations/*.js'],
  migrationsTableName: 'migration',
});
