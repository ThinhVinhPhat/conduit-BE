import { NestFactory } from '@nestjs/core';
import { MainModule } from 'apps/main-service/src/main.module';
import { TaskConsumer } from './domain/task/task.consumer';

async function bootstrap(message: string) {
  const app = await NestFactory.create(MainModule);
  const jobConsumer = app.get(TaskConsumer);
  jobConsumer.consume(message);
}
bootstrap('start');
