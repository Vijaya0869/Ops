import { Module } from '@nestjs/common';
import { DealAnalysesController } from './deal-analyses.controller';
import { DealAnalysesService } from './deal-analyses.service';

@Module({
  controllers: [DealAnalysesController],
  providers: [DealAnalysesService],
})
export class DealAnalysesModule {}
