import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationEventType } from '@prisma/client';
import { SendNotificationDto } from './dto/send-notification.dto';

interface Recipient {
  email: string;
  name?: string | null;
}

interface EventContext {
  dealTitle?: string;
  oldStage?: string;
  newStage?: string;
  propertyAddress?: string;
  milestone?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly resend: Resend | null;
  private readonly fromEmail: string;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    this.resend = apiKey ? new Resend(apiKey) : null;
    this.fromEmail = this.config.get<string>(
      'RESEND_FROM_EMAIL',
      'onboarding@resend.dev',
    );
  }

  async send(recipient: Recipient, dto: SendNotificationDto) {
    const { subject, html } = this.render(recipient, dto);
    await this.deliver(recipient.email, subject, html);
  }

  // Fires an event-driven notification for a user's own data (deal stage
  // change, property sold/acquired, new deal). Email and Slack are gated
  // independently — a user can e.g. keep Slack on for every deal stage
  // change (easy to scan) while only emailing themselves for higher-signal
  // events, instead of one toggle flooding both channels equally.
  async notifyEvent(
    userId: string,
    event: NotificationEventType,
    context: EventContext,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        fullName: true,
        emailNotificationEvents: true,
        slackNotificationEvents: true,
        slackWebhookUrl: true,
      },
    });
    if (!user) return;

    const wantsEmail = user.emailNotificationEvents.includes(event);
    const wantsSlack = user.slackNotificationEvents.includes(event);
    if (!wantsEmail && !wantsSlack) return;

    const dto: SendNotificationDto = {
      type:
        event === 'deal_stage_change'
          ? 'deal_stage_change'
          : event === 'new_deal'
            ? 'new_deal'
            : 'property_milestone',
      dealTitle: context.dealTitle,
      oldStage: context.oldStage,
      newStage: context.newStage,
      propertyAddress: context.propertyAddress,
      milestone: context.milestone,
    };
    const { subject, html, text } = this.render(
      { email: user.email, name: user.fullName },
      dto,
    );

    if (wantsEmail) {
      await this.deliver(user.email, subject, html);
    }
    if (wantsSlack && user.slackWebhookUrl) {
      await this.deliverSlack(user.slackWebhookUrl, text);
    }
  }

  async sendPasswordReset(email: string, resetUrl: string) {
    await this.deliver(
      email,
      'Reset your password',
      `<p>Hi,</p><p>Click the link below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you didn't request this, you can ignore this email.</p>`,
    );
  }

  private async deliver(to: string, subject: string, html: string) {
    if (!this.resend) {
      this.logger.log(
        `Email skipped (no RESEND_API_KEY configured): to=${to} subject="${subject}"`,
      );
      return;
    }

    const { error } = await this.resend.emails.send({
      from: this.fromEmail,
      to,
      subject,
      html,
    });

    // The Resend SDK reports API-level failures (invalid recipient, sandbox
    // restrictions, etc.) via this `error` field rather than throwing — an
    // unchecked call silently "succeeds" even when nothing was sent.
    if (error) {
      this.logger.error(
        `Resend rejected email to=${to}: ${error.name} — ${error.message}`,
      );
    }
  }

  private async deliverSlack(webhookUrl: string, text: string) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        this.logger.error(
          `Slack webhook rejected message: ${response.status} ${await response.text()}`,
        );
      }
    } catch (err) {
      this.logger.error(`Slack webhook delivery failed: ${err}`);
    }
  }

  private render(recipient: Recipient, dto: SendNotificationDto) {
    const greeting = recipient.name ? `Hi ${recipient.name},` : 'Hi,';

    if (dto.type === 'deal_stage_change') {
      return {
        subject: `Deal update: ${dto.dealTitle} moved to ${dto.newStage}`,
        html: `<p>${greeting}</p><p><strong>${dto.dealTitle}</strong> moved from <strong>${dto.oldStage}</strong> to <strong>${dto.newStage}</strong>.</p>`,
        text: `${dto.dealTitle} moved from ${dto.oldStage} to ${dto.newStage}.`,
      };
    }

    if (dto.type === 'new_deal') {
      return {
        subject: `New deal added: ${dto.dealTitle}`,
        html: `<p>${greeting}</p><p>A new deal was added: <strong>${dto.dealTitle}</strong>.</p>`,
        text: `New deal added: ${dto.dealTitle}`,
      };
    }

    return {
      subject: `Property milestone: ${dto.propertyAddress}`,
      html: `<p>${greeting}</p><p><strong>${dto.propertyAddress}</strong> reached milestone: <strong>${dto.milestone}</strong>.</p>`,
      text: `${dto.propertyAddress} reached milestone: ${dto.milestone}.`,
    };
  }
}
