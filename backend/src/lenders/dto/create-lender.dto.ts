import { IsOptional, IsString } from 'class-validator';

export class CreateLenderDto {
  @IsString()
  name: string;

  @IsOptional() @IsString() contactName?: string;
  @IsOptional() @IsString() contactEmail?: string;
  @IsOptional() @IsString() contactPhone?: string;
  @IsOptional() @IsString() lenderType?: string;
  @IsOptional() @IsString() notes?: string;
}
