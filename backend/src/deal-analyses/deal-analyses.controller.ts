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
import { DealAnalysesService } from './deal-analyses.service';
import { CreateDealAnalysisDto } from './dto/create-deal-analysis.dto';
import { UpdateDealAnalysisDto } from './dto/update-deal-analysis.dto';

@UseGuards(JwtAuthGuard)
@Controller('deal-analyses')
export class DealAnalysesController {
  constructor(private readonly dealAnalysesService: DealAnalysesService) {}

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.dealAnalysesService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.dealAnalysesService.findOne(user.userId, id);
  }

  @Post()
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateDealAnalysisDto,
  ) {
    return this.dealAnalysesService.create(user.userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateDealAnalysisDto,
  ) {
    return this.dealAnalysesService.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.dealAnalysesService.remove(user.userId, id);
  }
}
