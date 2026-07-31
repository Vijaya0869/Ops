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
import { RenovationItemsService } from './renovation-items.service';
import { CreateRenovationItemDto } from './dto/create-renovation-item.dto';
import { UpdateRenovationItemDto } from './dto/update-renovation-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('renovation-items')
export class RenovationItemsController {
  constructor(
    private readonly renovationItemsService: RenovationItemsService,
  ) {}

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.renovationItemsService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.renovationItemsService.findOne(user.userId, id);
  }

  @Post()
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateRenovationItemDto,
  ) {
    return this.renovationItemsService.create(user.userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateRenovationItemDto,
  ) {
    return this.renovationItemsService.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.renovationItemsService.remove(user.userId, id);
  }
}
