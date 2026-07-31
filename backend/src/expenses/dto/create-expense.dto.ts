import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  propertyId: string;

  @IsString()
  category: string;

  @IsOptional() @IsString() description?: string;

  @IsNumber()
  amount: number;

  @Type(() => Date)
  @IsDate()
  expenseDate: Date;
}
