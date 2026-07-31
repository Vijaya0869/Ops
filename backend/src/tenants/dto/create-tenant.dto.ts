import { TenantStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTenantDto {
  @IsString()
  propertyId: string;

  @IsString()
  fullName: string;

  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;

  @IsOptional() @Type(() => Date) @IsDate() leaseStart?: Date;
  @IsOptional() @Type(() => Date) @IsDate() leaseEnd?: Date;

  @IsNumber()
  monthlyRent: number;

  @IsOptional() @IsNumber() depositAmount?: number;
  @IsOptional() @IsEnum(TenantStatus) status?: TenantStatus;
}
