import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { diskStorageFor } from '../common/upload.util';
import { PropertyPhotosService } from './property-photos.service';

@UseGuards(JwtAuthGuard)
@Controller('property-photos')
export class PropertyPhotosController {
  constructor(private readonly propertyPhotosService: PropertyPhotosService) {}

  @Get()
  findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Query('propertyId') propertyId: string,
  ) {
    if (!propertyId) throw new BadRequestException('propertyId is required');
    return this.propertyPhotosService.findAll(user.userId, propertyId);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', { storage: diskStorageFor('photos') }),
  )
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Query('propertyId') propertyId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!propertyId) throw new BadRequestException('propertyId is required');
    if (!file) throw new BadRequestException('file is required');
    return this.propertyPhotosService.create(user.userId, propertyId, file);
  }

  @Patch(':id/primary')
  setPrimary(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.propertyPhotosService.setPrimary(user.userId, id);
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.propertyPhotosService.remove(user.userId, id);
  }
}
