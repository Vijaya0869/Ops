import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertOwnsDeal } from '../common/ownership.util';
import { CreateDealCostDto } from './dto/create-deal-cost.dto';
import { UpdateDealCostDto } from './dto/update-deal-cost.dto';

@Injectable()
export class DealCostsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.dealCost.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const cost = await this.prisma.dealCost.findUnique({ where: { id } });
    if (!cost) throw new NotFoundException('Deal cost not found');
    if (cost.userId !== userId) throw new ForbiddenException();
    return cost;
  }

  async create(userId: string, dto: CreateDealCostDto) {
    await assertOwnsDeal(this.prisma, userId, dto.dealId);
    return this.prisma.dealCost.create({ data: { ...dto, userId } });
  }

  async update(userId: string, id: string, dto: UpdateDealCostDto) {
    await this.findOne(userId, id);
    if (dto.dealId) {
      await assertOwnsDeal(this.prisma, userId, dto.dealId);
    }
    return this.prisma.dealCost.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.dealCost.delete({ where: { id } });
    return { success: true };
  }
}
