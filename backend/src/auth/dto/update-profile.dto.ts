import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { NotificationEventType } from '@prisma/client';

const NOTIFICATION_EVENT_VALUES: NotificationEventType[] = [
  'deal_stage_change',
  'property_sold',
  'property_acquired',
  'new_deal',
];

export class UpdateProfileDto {
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() companyName?: string;

  @IsOptional()
  @IsArray()
  @IsIn(NOTIFICATION_EVENT_VALUES, { each: true })
  emailNotificationEvents?: NotificationEventType[];

  @IsOptional()
  @IsArray()
  @IsIn(NOTIFICATION_EVENT_VALUES, { each: true })
  slackNotificationEvents?: NotificationEventType[];

  @IsOptional() @IsString() slackWebhookUrl?: string | null;
}
