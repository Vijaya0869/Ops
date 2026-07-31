import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertOwnsProperty } from '../common/ownership.util';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.expense.findMany({
      where: { userId },
      orderBy: { expenseDate: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const expense = await this.prisma.expense.findUnique({ where: { id } });
    if (!expense) throw new NotFoundException('Expense not found');
    if (expense.userId !== userId) throw new ForbiddenException();
    return expense;
  }

  async create(userId: string, dto: CreateExpenseDto) {
    await assertOwnsProperty(this.prisma, userId, dto.propertyId);
    return this.prisma.expense.create({ data: { ...dto, userId } });
  }

  async update(userId: string, id: string, dto: UpdateExpenseDto) {
    await this.findOne(userId, id);
    if (dto.propertyId) {
      await assertOwnsProperty(this.prisma, userId, dto.propertyId);
    }
    return this.prisma.expense.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.expense.delete({ where: { id } });
    return { success: true };
  }
}
