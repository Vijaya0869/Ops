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
import { RentPaymentsService } from './rent-payments.service';
import { CreateRentPaymentDto } from './dto/create-rent-payment.dto';
import { UpdateRentPaymentDto } from './dto/update-rent-payment.dto';

@UseGuards(JwtAuthGuard)
@Controller('rent-payments')
export class RentPaymentsController {
  constructor(private readonly rentPaymentsService: RentPaymentsService) {}

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.rentPaymentsService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.rentPaymentsService.findOne(user.userId, id);
  }

  @Post()
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateRentPaymentDto,
  ) {
    return this.rentPaymentsService.create(user.userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateRentPaymentDto,
  ) {
    return this.rentPaymentsService.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.rentPaymentsService.remove(user.userId, id);
  }
}
