import { Module } from '@nestjs/common';
import { PropertyPhotosController } from './property-photos.controller';
import { PropertyPhotosService } from './property-photos.service';

@Module({
  controllers: [PropertyPhotosController],
  providers: [PropertyPhotosService],
})
export class PropertyPhotosModule {}
