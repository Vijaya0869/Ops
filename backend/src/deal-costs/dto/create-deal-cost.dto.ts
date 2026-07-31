import { CostType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDealCostDto {
  @IsString()
  dealId: string;

  @IsEnum(CostType)
  costType: CostType;

  @IsString()
  category: string;

  @IsOptional() @IsString() description?: string;

  @IsNumber()
  amount: number;
}
