import { IsIn, IsOptional, IsString } from 'class-validator';

export type NotificationType =
  'deal_stage_change' | 'property_milestone' | 'new_deal';

export class SendNotificationDto {
  @IsIn(['deal_stage_change', 'property_milestone', 'new_deal'])
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
