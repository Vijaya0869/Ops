import { Module } from '@nestjs/common';
import { PropertyDocumentsController } from './property-documents.controller';
import { PropertyDocumentsService } from './property-documents.service';

@Module({
  controllers: [PropertyDocumentsController],
  providers: [PropertyDocumentsService],
})
export class PropertyDocumentsModule {}
