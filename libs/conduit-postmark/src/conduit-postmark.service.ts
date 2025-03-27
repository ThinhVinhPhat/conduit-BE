import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'postmark';
import { MessageSendingResponse } from 'postmark/dist/client/models';

@Injectable()
export class ConduitPostmarkService {
  constructor(
    @Inject('POSTMARK_CLIENT') private readonly postmarkClient: Client,
  ) {}

  async sendEmail(
    from: string,
    to: string,
    subject: string,
    textBody: string,
    htmlBody: string,
  ): Promise<MessageSendingResponse> {
    return this.postmarkClient.sendEmail({
      From: from,
      To: to,
      Subject: subject,
      TextBody: textBody,
      HtmlBody: htmlBody,
    });
  }

  async sendTemplateEmail(
    templateId: number,
    templateModel: object,
    to: string,
    from: string,
  ): Promise<MessageSendingResponse> {
    return this.postmarkClient.sendEmailWithTemplate({
      TemplateId: templateId,
      TemplateModel: templateModel,
      From: from,
      To: to,
    });
  }
}
