import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { diskStorageFor } from '../common/upload.util';
import { PropertyDocumentsService } from './property-documents.service';

@UseGuards(JwtAuthGuard)
@Controller('property-documents')
export class PropertyDocumentsController {
  constructor(
    private readonly propertyDocumentsService: PropertyDocumentsService,
  ) {}

  @Get()
  findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Query('propertyId') propertyId: string,
  ) {
    if (!propertyId) throw new BadRequestException('propertyId is required');
    return this.propertyDocumentsService.findAll(user.userId, propertyId);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', { storage: diskStorageFor('documents') }),
  )
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Query('propertyId') propertyId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('documentType') documentType?: string,
  ) {
    if (!propertyId) throw new BadRequestException('propertyId is required');
    if (!file) throw new BadRequestException('file is required');
    return this.propertyDocumentsService.create(
      user.userId,
      propertyId,
      file,
      documentType,
    );
  }

  @Get(':id/download')
  async download(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const { absolutePath, fileName } =
      await this.propertyDocumentsService.getDownloadInfo(user.userId, id);
    res.download(absolutePath, fileName);
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.propertyDocumentsService.remove(user.userId, id);
  }
}
