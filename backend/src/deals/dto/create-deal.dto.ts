import { DealStage } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDealDto {
  @IsString()
  title: string;

  @IsOptional() @IsString() propertyId?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;

  @IsOptional() @IsNumber() askingPrice?: number;
  @IsOptional() @IsNumber() offerPrice?: number;
  @IsOptional() @IsNumber() arv?: number;
  @IsOptional() @IsNumber() rehabEstimate?: number;
  @IsOptional() @IsNumber() expectedProfit?: number;

  @IsOptional() @IsString() contactName?: string;
  @IsOptional() @IsString() contactPhone?: string;
  @IsOptional() @IsString() contactEmail?: string;
  @IsOptional() @IsString() source?: string;

  @IsOptional() @IsEnum(DealStage) stage?: DealStage;
  @IsOptional() @IsString() notes?: string;
}
