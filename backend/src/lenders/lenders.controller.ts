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
import { LendersService } from './lenders.service';
import { CreateLenderDto } from './dto/create-lender.dto';
import { UpdateLenderDto } from './dto/update-lender.dto';

@UseGuards(JwtAuthGuard)
@Controller('lenders')
export class LendersController {
  constructor(private readonly lendersService: LendersService) {}

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.lendersService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.lendersService.findOne(user.userId, id);
  }

  @Post()
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateLenderDto,
  ) {
    return this.lendersService.create(user.userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateLenderDto,
  ) {
    return this.lendersService.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.lendersService.remove(user.userId, id);
  }
}
