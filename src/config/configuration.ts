import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().min(1),
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.string().min(1),
  DATABASE_USERNAME: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.string().min(1),
});

const env = envSchema.parse(process.env);

export default () => ({
  port: parseInt(env.PORT, 10) || 3000,
  database: {
    host: env.DATABASE_HOST,
    port: parseInt(env.DATABASE_PORT, 10) || 5432,
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
  },
  redis: {
    host: env.REDIS_HOST,
    port: parseInt(env.REDIS_PORT, 10) || 6379,
  }
});
