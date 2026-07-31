import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertOwnsProperty } from '../common/ownership.util';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';

@Injectable()
export class DealsService {
  constructor(private readonly prisma: PrismaService) {}

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
    return this.prisma.deal.create({ data: { ...dto, userId } });
  }

  async update(userId: string, id: string, dto: UpdateDealDto) {
    await this.findOne(userId, id);
    if (dto.propertyId) {
      await assertOwnsProperty(this.prisma, userId, dto.propertyId);
    }
    return this.prisma.deal.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.deal.delete({ where: { id } });
    return { success: true };
  }
}
