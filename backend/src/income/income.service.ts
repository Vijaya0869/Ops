import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertOwnsProperty } from '../common/ownership.util';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomeService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.income.findMany({
      where: { userId },
      orderBy: { incomeDate: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const income = await this.prisma.income.findUnique({ where: { id } });
    if (!income) throw new NotFoundException('Income not found');
    if (income.userId !== userId) throw new ForbiddenException();
    return income;
  }

  async create(userId: string, dto: CreateIncomeDto) {
    await assertOwnsProperty(this.prisma, userId, dto.propertyId);
    return this.prisma.income.create({ data: { ...dto, userId } });
  }

  async update(userId: string, id: string, dto: UpdateIncomeDto) {
    await this.findOne(userId, id);
    if (dto.propertyId) {
      await assertOwnsProperty(this.prisma, userId, dto.propertyId);
    }
    return this.prisma.income.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.income.delete({ where: { id } });
    return { success: true };
  }
}
