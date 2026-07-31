import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRenovationItemDto {
  @IsString()
  propertyId: string;

  @IsOptional() @IsString() projectId?: string;

  @IsString()
  category: string;

  @IsOptional() @IsString() description?: string;

  @IsNumber()
  estimatedCost: number;

  @IsOptional() @IsNumber() actualCost?: number;
  @IsOptional() @IsBoolean() completed?: boolean;
}
