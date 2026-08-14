import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

const OWNED_STATUSES = ['owned', 'in_rehab', 'listed', 'rental'];

@Injectable()
export class PropertiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

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
    const before = await this.findOne(userId, id);
    // Only the keys present in the DTO are sent to Prisma — omitted fields
    // are left untouched rather than nulled. See useProperties.ts for the
    // same fix on the frontend/Supabase side.
    const updated = await this.prisma.property.update({
      where: { id },
      data: dto,
    });

    if (dto.status && dto.status !== before.status) {
      if (dto.status === 'sold') {
        await this.notifications.notifyEvent(userId, 'property_sold', {
          propertyAddress: before.address,
          milestone: 'sold',
        });
      } else if (
        !OWNED_STATUSES.includes(before.status) &&
        OWNED_STATUSES.includes(dto.status)
      ) {
        await this.notifications.notifyEvent(userId, 'property_acquired', {
          propertyAddress: before.address,
          milestone: 'acquired',
        });
      }
    }

    return updated;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.property.delete({ where: { id } });
    return { success: true };
  }
}
