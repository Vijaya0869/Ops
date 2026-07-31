import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertOwnsTenant } from '../common/ownership.util';
import { CreateRentPaymentDto } from './dto/create-rent-payment.dto';
import { UpdateRentPaymentDto } from './dto/update-rent-payment.dto';

@Injectable()
export class RentPaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.rentPayment.findMany({
      where: { tenant: { userId } },
      orderBy: { dueDate: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const payment = await this.prisma.rentPayment.findUnique({
      where: { id },
      include: { tenant: true },
    });
    if (!payment) throw new NotFoundException('Rent payment not found');
    if (payment.tenant.userId !== userId) throw new ForbiddenException();
    return payment;
  }

  async create(userId: string, dto: CreateRentPaymentDto) {
    await assertOwnsTenant(this.prisma, userId, dto.tenantId);
    return this.prisma.rentPayment.create({ data: dto });
  }

  async update(userId: string, id: string, dto: UpdateRentPaymentDto) {
    await this.findOne(userId, id);
    if (dto.tenantId) {
      await assertOwnsTenant(this.prisma, userId, dto.tenantId);
    }
    return this.prisma.rentPayment.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.rentPayment.delete({ where: { id } });
    return { success: true };
  }
}
