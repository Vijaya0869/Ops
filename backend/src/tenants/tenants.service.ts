import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertOwnsProperty } from '../common/ownership.util';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.tenant.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    if (tenant.userId !== userId) throw new ForbiddenException();
    return tenant;
  }

  async create(userId: string, dto: CreateTenantDto) {
    await assertOwnsProperty(this.prisma, userId, dto.propertyId);
    return this.prisma.tenant.create({ data: { ...dto, userId } });
  }

  async update(userId: string, id: string, dto: UpdateTenantDto) {
    await this.findOne(userId, id);
    if (dto.propertyId) {
      await assertOwnsProperty(this.prisma, userId, dto.propertyId);
    }
    return this.prisma.tenant.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.tenant.delete({ where: { id } });
    return { success: true };
  }
}
