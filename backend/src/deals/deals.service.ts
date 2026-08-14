import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertOwnsProperty } from '../common/ownership.util';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';

@Injectable()
export class DealsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  findAll(userId: string) {
    return this.prisma.deal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const deal = await this.prisma.deal.findUnique({ where: { id } });
    if (!deal) throw new NotFoundException('Deal not found');
    if (deal.userId !== userId) throw new ForbiddenException();
    return deal;
  }

  async create(userId: string, dto: CreateDealDto) {
    if (dto.propertyId) {
      await assertOwnsProperty(this.prisma, userId, dto.propertyId);
    }
    const deal = await this.prisma.deal.create({ data: { ...dto, userId } });
    await this.notifications.notifyEvent(userId, 'new_deal', {
      dealTitle: deal.title,
    });
    return deal;
  }

  async update(userId: string, id: string, dto: UpdateDealDto) {
    const deal = await this.findOne(userId, id);
    if (dto.propertyId) {
      await assertOwnsProperty(this.prisma, userId, dto.propertyId);
    }

    // Closing a deal that isn't linked to a property yet turns it into one,
    // so the deal's numbers carry forward instead of vanishing at "closed".
    let propertyId = dto.propertyId;
    if (dto.stage === 'closed' && !deal.propertyId && !propertyId) {
      const property = await this.prisma.property.create({
        data: {
          userId,
          address: deal.address || deal.title,
          city: deal.city,
          state: deal.state,
          purchasePrice: deal.offerPrice ?? deal.askingPrice ?? null,
          arv: deal.arv,
          rehabBudget: deal.rehabEstimate,
          status: 'owned',
          acquisitionDate: new Date(),
        },
      });
      propertyId = property.id;
    }

    const updated = await this.prisma.deal.update({
      where: { id },
      data: { ...dto, ...(propertyId ? { propertyId } : {}) },
    });

    if (dto.stage && dto.stage !== deal.stage) {
      await this.notifications.notifyEvent(userId, 'deal_stage_change', {
        dealTitle: deal.title,
        oldStage: deal.stage,
        newStage: dto.stage,
      });
    }

    return updated;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.deal.delete({ where: { id } });
    return { success: true };
  }
}
