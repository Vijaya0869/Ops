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
export class PropertyDocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, propertyId: string) {
    await assertOwnsProperty(this.prisma, userId, propertyId);
    return this.prisma.propertyDocument.findMany({
      where: { propertyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const doc = await this.prisma.propertyDocument.findUnique({
      where: { id },
    });
    if (!doc) throw new NotFoundException('Document not found');
    if (doc.userId !== userId) throw new ForbiddenException();
    return doc;
  }

  async create(
    userId: string,
    propertyId: string,
    file: Express.Multer.File,
    documentType?: string,
  ) {
    await assertOwnsProperty(this.prisma, userId, propertyId);

    return this.prisma.propertyDocument.create({
      data: {
        userId,
        propertyId,
        fileName: file.originalname,
        filePath: publicUrlFor('documents', file.filename),
        fileType: file.mimetype,
        fileSize: file.size,
        documentType: documentType || null,
      },
    });
  }

  async remove(userId: string, id: string) {
    const doc = await this.findOne(userId, id);
    await unlink(absolutePathFor(doc.filePath)).catch(() => undefined);
    await this.prisma.propertyDocument.delete({ where: { id } });
    return { success: true };
  }

  async getDownloadInfo(userId: string, id: string) {
    const doc = await this.findOne(userId, id);
    return {
      absolutePath: absolutePathFor(doc.filePath),
      fileName: doc.fileName,
    };
  }
}
