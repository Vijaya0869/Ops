import { Module } from '@nestjs/common';
import { RenovationItemsController } from './renovation-items.controller';
import { RenovationItemsService } from './renovation-items.service';

@Module({
  controllers: [RenovationItemsController],
  providers: [RenovationItemsService],
})
export class RenovationItemsModule {}
