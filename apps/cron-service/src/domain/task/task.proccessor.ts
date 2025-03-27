import { DatabaseService } from '@lib/database';
import { InjectQueue } from '@nestjs/bullmq';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { Queue } from 'bullmq';

@Injectable()
export class TaskProcessor {
  private readonly logger: Logger;
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly prisma: DatabaseService,
    @InjectQueue('email-queue')
    private readonly emailQueue: Queue,
  ) {
    this.logger = new Logger(TaskProcessor.name);
  }

  private async reportCurrentFollower() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          email: true,
          name: true,
          _count: {
            select: {
              following: true,
            },
          },
        },
      });
      for (const user of users) {
        await this.emailQueue.add('sendEmail', user);
      }
    } catch (error) {}
  }

  @Cron('0 7 * * 5', { name: 'createSendEmail' })
  async createSendEmailCron() {
    await this.reportCurrentFollower();
    return {
      status: HttpStatus.OK,
      message: 'Create Emails successfully',
    };
  }

  async stopSendEmailCron() {
    const job = this.schedulerRegistry.getCronJob('sendFollowerReport');
    if (job) {
      job.stop();
      return {
        status: HttpStatus.OK,
        message: 'Cron job paused',
      };
    }
  }

  async resumeSendEmailCron() {
    const job = this.schedulerRegistry.getCronJob('sendFollowerReport');
    if (job) {
      job.start();
      return {
        status: HttpStatus.OK,

        message: 'Cron job resumed',
      };
    }
  }

  async deleteEmailCron() {
    const job = this.schedulerRegistry.getCronJob('sendFollowerReport');
    if (job) {
      this.schedulerRegistry.deleteCronJob('sendFollowerReport');
      return {
        status: HttpStatus.OK,
        message: 'Cron job deleted',
      };
    }
  }
}
