import { PartialType } from '@nestjs/mapped-types';
import { CreateDealCostDto } from './create-deal-cost.dto';

export class UpdateDealCostDto extends PartialType(CreateDealCostDto) {}
