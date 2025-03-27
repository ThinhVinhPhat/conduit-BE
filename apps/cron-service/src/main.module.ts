import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './domain/task/task.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ScheduleModule.forRoot({
      cronJobs: true,
    }),
    BullModule.forRoot('alternative-config', {
      redis: {
        port: 6381,
        host: 'localhost',
      },
    }),
    BullModule.registerQueue({
      configKey: 'alternative-config',
      name: 'task',
    }),
    TaskModule,
  ],
})
export class CronServiceModule {}
