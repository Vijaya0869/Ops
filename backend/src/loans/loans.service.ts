import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertOwnsLender, assertOwnsProperty } from '../common/ownership.util';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoansService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.loan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const loan = await this.prisma.loan.findUnique({ where: { id } });
    if (!loan) throw new NotFoundException('Loan not found');
    if (loan.userId !== userId) throw new ForbiddenException();
    return loan;
  }

  async create(userId: string, dto: CreateLoanDto) {
    await assertOwnsProperty(this.prisma, userId, dto.propertyId);
    if (dto.lenderId) {
      await assertOwnsLender(this.prisma, userId, dto.lenderId);
    }
    return this.prisma.loan.create({ data: { ...dto, userId } });
  }

  async update(userId: string, id: string, dto: UpdateLoanDto) {
    await this.findOne(userId, id);
    if (dto.propertyId) {
      await assertOwnsProperty(this.prisma, userId, dto.propertyId);
    }
    if (dto.lenderId) {
      await assertOwnsLender(this.prisma, userId, dto.lenderId);
    }
    return this.prisma.loan.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.loan.delete({ where: { id } });
    return { success: true };
  }
}
