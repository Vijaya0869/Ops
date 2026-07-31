import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { DealCostsService } from './deal-costs.service';
import { CreateDealCostDto } from './dto/create-deal-cost.dto';
import { UpdateDealCostDto } from './dto/update-deal-cost.dto';

@UseGuards(JwtAuthGuard)
@Controller('deal-costs')
export class DealCostsController {
  constructor(private readonly dealCostsService: DealCostsService) {}

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.dealCostsService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.dealCostsService.findOne(user.userId, id);
  }

  @Post()
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateDealCostDto,
  ) {
    return this.dealCostsService.create(user.userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateDealCostDto,
  ) {
    return this.dealCostsService.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.dealCostsService.remove(user.userId, id);
  }
}
