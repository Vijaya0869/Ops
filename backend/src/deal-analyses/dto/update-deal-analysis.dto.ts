import { PartialType } from '@nestjs/mapped-types';
import { CreateDealAnalysisDto } from './create-deal-analysis.dto';

export class UpdateDealAnalysisDto extends PartialType(CreateDealAnalysisDto) {}
