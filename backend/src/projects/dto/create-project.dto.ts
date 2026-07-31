import { ProjectStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  propertyId: string;

  @IsString()
  name: string;

  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(ProjectStatus) status?: ProjectStatus;
  @IsOptional() @IsNumber() budget?: number;
  @IsOptional() @IsNumber() actualCost?: number;
  @IsOptional() @Type(() => Date) @IsDate() startDate?: Date;
  @IsOptional() @Type(() => Date) @IsDate() endDate?: Date;
}
