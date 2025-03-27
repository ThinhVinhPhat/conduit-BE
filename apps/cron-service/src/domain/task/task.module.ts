import { Module } from '@nestjs/common';
import { TaskConsumer } from './task.consumer';
import { TaskProcessor } from './task.proccessor';

@Module({
  imports: [],
  providers: [TaskConsumer, TaskProcessor],
})
export class TaskModule {}
