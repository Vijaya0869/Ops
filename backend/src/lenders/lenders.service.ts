import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLenderDto } from './dto/create-lender.dto';
import { UpdateLenderDto } from './dto/update-lender.dto';

@Injectable()
export class LendersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.lender.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const lender = await this.prisma.lender.findUnique({ where: { id } });
    if (!lender) throw new NotFoundException('Lender not found');
    if (lender.userId !== userId) throw new ForbiddenException();
    return lender;
  }

  create(userId: string, dto: CreateLenderDto) {
    return this.prisma.lender.create({ data: { ...dto, userId } });
  }

  async update(userId: string, id: string, dto: UpdateLenderDto) {
    await this.findOne(userId, id);
    return this.prisma.lender.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.lender.delete({ where: { id } });
    return { success: true };
  }
}
