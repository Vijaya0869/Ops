import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertOwnsDeal } from '../common/ownership.util';
import { CreateDealAnalysisDto } from './dto/create-deal-analysis.dto';
import { UpdateDealAnalysisDto } from './dto/update-deal-analysis.dto';

@Injectable()
export class DealAnalysesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.dealAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const analysis = await this.prisma.dealAnalysis.findUnique({
      where: { id },
    });
    if (!analysis) throw new NotFoundException('Deal analysis not found');
    if (analysis.userId !== userId) throw new ForbiddenException();
    return analysis;
  }

  async create(userId: string, dto: CreateDealAnalysisDto) {
    await assertOwnsDeal(this.prisma, userId, dto.dealId);
    return this.prisma.dealAnalysis.create({ data: { ...dto, userId } });
  }

  async update(userId: string, id: string, dto: UpdateDealAnalysisDto) {
    await this.findOne(userId, id);
    if (dto.dealId) {
      await assertOwnsDeal(this.prisma, userId, dto.dealId);
    }
    return this.prisma.dealAnalysis.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.dealAnalysis.delete({ where: { id } });
    return { success: true };
  }
}
