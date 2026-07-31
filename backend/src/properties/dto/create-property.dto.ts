import { PropertyStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  address: string;

  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() zipCode?: string;
  @IsOptional() @IsString() county?: string;
  @IsOptional() @IsString() propertyType?: string;

  @IsOptional() @IsInt() bedrooms?: number;
  @IsOptional() @IsNumber() bathrooms?: number;
  @IsOptional() @IsInt() squareFeet?: number;
  @IsOptional() @IsNumber() lotSize?: number;
  @IsOptional() @IsInt() yearBuilt?: number;

  @IsOptional() @IsNumber() purchasePrice?: number;
  @IsOptional() @IsNumber() arv?: number;
  @IsOptional() @IsNumber() rehabBudget?: number;
  @IsOptional() @IsNumber() actualRehabCost?: number;
  @IsOptional() @IsNumber() holdingCosts?: number;
  @IsOptional() @IsNumber() salePrice?: number;
  @IsOptional() @IsNumber() monthlyRent?: number;
  @IsOptional() @IsNumber() monthlyExpenses?: number;
  @IsOptional() @IsNumber() loanAmount?: number;
  @IsOptional() @IsNumber() interestRate?: number;

  @IsOptional() @IsString() lenderName?: string;
  @IsOptional() @IsEnum(PropertyStatus) status?: PropertyStatus;
  @IsOptional() @IsDateString() acquisitionDate?: string;
  @IsOptional() @IsDateString() saleDate?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() mlsNumber?: string;
}
