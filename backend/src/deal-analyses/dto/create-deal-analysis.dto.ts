import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDealAnalysisDto {
  @IsString()
  dealId: string;

  @IsOptional() @IsNumber() locationScore?: number;
  @IsOptional() @IsNumber() conditionScore?: number;
  @IsOptional() @IsNumber() financialScore?: number;
  @IsOptional() @IsNumber() riskScore?: number;
  @IsOptional() @IsNumber() totalScore?: number;

  @IsOptional() @IsString() recommendation?: string;
  @IsOptional() @IsString() notes?: string;
}
