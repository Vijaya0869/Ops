import { LoanStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLoanDto {
  @IsString()
  propertyId: string;

  @IsOptional() @IsString() lenderId?: string;

  @IsNumber()
  principal: number;

  @IsNumber()
  interestRate: number;

  @IsOptional() @IsInt() termMonths?: number;
  @IsOptional() @IsNumber() monthlyPayment?: number;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsOptional() @IsEnum(LoanStatus) status?: LoanStatus;
}
