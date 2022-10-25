import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';

import { BatchJobsModule } from './app/batch-jobs/batch-jobs.module';
import { HealthModule } from './app/health/health.module';
import configuration from './config/configuration';
import { SubscribersModule } from './app/subscribers/subscribers.module';
import { ProcessorModule } from './app/processor/processor.module';
import { FilesModule } from './app/files/files.module';

const modules = [
  ConfigModule.forRoot({
    load: [configuration],
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get('database.host'),
      port: configService.get('database.port'),
      username: configService.get('database.username'),
      password: configService.get('database.password'),
      database: configService.get('database.database'),
      synchronize: true,
      autoLoadEntities: true,
    }),
  }),
  EventEmitterModule.forRoot(),
  BullModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      redis: {
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
      },
    }),
  }),
  ProcessorModule,
  HealthModule,
  BatchJobsModule,
  SubscribersModule,
  FilesModule,
];

@Module({
  imports: modules,
  controllers: [],
  providers: [],
})
export class AppModule {}
