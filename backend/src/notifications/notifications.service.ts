import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { SendNotificationDto } from './dto/send-notification.dto';

interface Recipient {
  email: string;
  name?: string | null;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly resend: Resend | null;
  private readonly fromEmail: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    this.resend = apiKey ? new Resend(apiKey) : null;
    this.fromEmail = this.config.get<string>(
      'RESEND_FROM_EMAIL',
      'onboarding@resend.dev',
    );
  }

  async send(recipient: Recipient, dto: SendNotificationDto) {
    const { subject, html } = this.render(recipient, dto);

    if (!this.resend) {
      this.logger.log(
        `Email skipped (no RESEND_API_KEY configured): to=${recipient.email} subject="${subject}"`,
      );
      return;
    }

    const { error } = await this.resend.emails.send({
      from: this.fromEmail,
      to: recipient.email,
      subject,
      html,
    });

    // The Resend SDK reports API-level failures (invalid recipient, sandbox
    // restrictions, etc.) via this `error` field rather than throwing — an
    // unchecked call silently "succeeds" even when nothing was sent.
    if (error) {
      this.logger.error(
        `Resend rejected email to=${recipient.email}: ${error.name} — ${error.message}`,
      );
    }
  }

  private render(recipient: Recipient, dto: SendNotificationDto) {
    const greeting = recipient.name ? `Hi ${recipient.name},` : 'Hi,';

    if (dto.type === 'deal_stage_change') {
      return {
        subject: `Deal update: ${dto.dealTitle} moved to ${dto.newStage}`,
        html: `<p>${greeting}</p><p><strong>${dto.dealTitle}</strong> moved from <strong>${dto.oldStage}</strong> to <strong>${dto.newStage}</strong>.</p>`,
      };
    }

    return {
      subject: `Property milestone: ${dto.propertyAddress}`,
      html: `<p>${greeting}</p><p><strong>${dto.propertyAddress}</strong> reached milestone: <strong>${dto.milestone}</strong>.</p>`,
    };
  }
}
