import { ConduitPostmarkService } from '@lib/conduit-postmark';
import { Process, Processor } from '@nestjs/bull';
import { emailTemplateMapper } from 'apps/main-service/src/constant/role';
import { Job } from 'bull';

@Processor('email-queue')
export class EmailQueriesProcessor {
  constructor(private readonly postmarkService: ConduitPostmarkService) {}

  @Process('sendEmail')
  async process(
    job: Job<{
      email: string;
      username: string;
      following: number;
    }>,
  ): Promise<any> {
    const { email, username, following } = job.data;

    await this.postmarkService.sendTemplateEmail(
      emailTemplateMapper.WELCOME_TEMPLATE,
      {
        email: email,
        username: username,
        followers: following,
      },
      'timetabte123@gmai.com',
      email,
    );
  }
}
