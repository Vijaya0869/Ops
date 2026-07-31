import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.property.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new NotFoundException('Property not found');
    if (property.userId !== userId) throw new ForbiddenException();
    return property;
  }

  create(userId: string, dto: CreatePropertyDto) {
    return this.prisma.property.create({
      data: { ...dto, userId },
    });
  }

  async update(userId: string, id: string, dto: UpdatePropertyDto) {
    await this.findOne(userId, id);
    // Only the keys present in the DTO are sent to Prisma — omitted fields
    // are left untouched rather than nulled. See useProperties.ts for the
    // same fix on the frontend/Supabase side.
    return this.prisma.property.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.property.delete({ where: { id } });
    return { success: true };
  }
}
