import { Module } from '@nestjs/common';
import { DealCostsController } from './deal-costs.controller';
import { DealCostsService } from './deal-costs.service';

@Module({
  controllers: [DealCostsController],
  providers: [DealCostsService],
})
export class DealCostsModule {}
