import { RentPaymentStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRentPaymentDto {
  @IsString()
  tenantId: string;

  @IsNumber()
  amountDue: number;

  @IsOptional() @IsNumber() amountPaid?: number;

  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @IsOptional() @Type(() => Date) @IsDate() paidDate?: Date;
  @IsOptional() @IsEnum(RentPaymentStatus) status?: RentPaymentStatus;
}
