import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  assertOwnsProject,
  assertOwnsProperty,
} from '../common/ownership.util';
import { CreateRenovationItemDto } from './dto/create-renovation-item.dto';
import { UpdateRenovationItemDto } from './dto/update-renovation-item.dto';

@Injectable()
export class RenovationItemsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.renovationItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const item = await this.prisma.renovationItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Renovation item not found');
    if (item.userId !== userId) throw new ForbiddenException();
    return item;
  }

  async create(userId: string, dto: CreateRenovationItemDto) {
    await assertOwnsProperty(this.prisma, userId, dto.propertyId);
    if (dto.projectId) {
      await assertOwnsProject(this.prisma, userId, dto.projectId);
    }
    return this.prisma.renovationItem.create({ data: { ...dto, userId } });
  }

  async update(userId: string, id: string, dto: UpdateRenovationItemDto) {
    await this.findOne(userId, id);
    if (dto.propertyId) {
      await assertOwnsProperty(this.prisma, userId, dto.propertyId);
    }
    if (dto.projectId) {
      await assertOwnsProject(this.prisma, userId, dto.projectId);
    }
    return this.prisma.renovationItem.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.renovationItem.delete({ where: { id } });
    return { success: true };
  }
}
