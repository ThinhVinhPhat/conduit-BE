import { Injectable } from '@nestjs/common';
import { TaskProcessor } from './task.proccessor';

@Injectable()
export class TaskConsumer {
  constructor(private readonly TaskProcessor: TaskProcessor) {}

  async consume(message: string) {
    if (message === 'create') {
      await this.TaskProcessor.createSendEmailCron();
    }
    if (message === 'stop') {
      await this.TaskProcessor.stopSendEmailCron();
    }
    if (message === 'resume') {
      await this.TaskProcessor.resumeSendEmailCron();
    }
    if (message === 'delete') {
      await this.TaskProcessor.deleteEmailCron();
    }
  }
}
