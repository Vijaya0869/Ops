import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { unlink } from 'fs/promises';
import { PrismaService } from '../prisma/prisma.service';
import { assertOwnsProperty } from '../common/ownership.util';
import { absolutePathFor, publicUrlFor } from '../common/upload.util';

@Injectable()
export class PropertyPhotosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, propertyId: string) {
    await assertOwnsProperty(this.prisma, userId, propertyId);
    return this.prisma.propertyPhoto.findMany({
      where: { propertyId },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(userId: string, id: string) {
    const photo = await this.prisma.propertyPhoto.findUnique({ where: { id } });
    if (!photo) throw new NotFoundException('Photo not found');
    if (photo.userId !== userId) throw new ForbiddenException();
    return photo;
  }

  async create(userId: string, propertyId: string, file: Express.Multer.File) {
    await assertOwnsProperty(this.prisma, userId, propertyId);
    const existingCount = await this.prisma.propertyPhoto.count({
      where: { propertyId },
    });

    return this.prisma.propertyPhoto.create({
      data: {
        userId,
        propertyId,
        fileName: file.originalname,
        filePath: publicUrlFor('photos', file.filename),
        isPrimary: existingCount === 0,
      },
    });
  }

  async setPrimary(userId: string, id: string) {
    const photo = await this.findOne(userId, id);
    await this.prisma.propertyPhoto.updateMany({
      where: { propertyId: photo.propertyId },
      data: { isPrimary: false },
    });
    return this.prisma.propertyPhoto.update({
      where: { id },
      data: { isPrimary: true },
    });
  }

  async remove(userId: string, id: string) {
    const photo = await this.findOne(userId, id);
    await unlink(absolutePathFor(photo.filePath)).catch(() => undefined);
    await this.prisma.propertyPhoto.delete({ where: { id } });
    return { success: true };
  }
}
