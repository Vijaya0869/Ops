import { IsIn, IsOptional, IsString } from 'class-validator';

export type NotificationType = 'deal_stage_change' | 'property_milestone';

export class SendNotificationDto {
  @IsIn(['deal_stage_change', 'property_milestone'])
  type: NotificationType;

  @IsOptional()
  @IsString()
  dealTitle?: string;

  @IsOptional()
  @IsString()
  oldStage?: string;

  @IsOptional()
  @IsString()
  newStage?: string;

  @IsOptional()
  @IsString()
  propertyAddress?: string;

  @IsOptional()
  @IsString()
  milestone?: string;
}
