import { PartialType } from '@nestjs/mapped-types';
import { CreateRenovationItemDto } from './create-renovation-item.dto';

export class UpdateRenovationItemDto extends PartialType(
  CreateRenovationItemDto,
) {}
