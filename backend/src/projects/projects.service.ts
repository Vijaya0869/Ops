import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertOwnsProperty } from '../common/ownership.util';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) throw new ForbiddenException();
    return project;
  }

  async create(userId: string, dto: CreateProjectDto) {
    await assertOwnsProperty(this.prisma, userId, dto.propertyId);
    return this.prisma.project.create({ data: { ...dto, userId } });
  }

  async update(userId: string, id: string, dto: UpdateProjectDto) {
    await this.findOne(userId, id);
    if (dto.propertyId) {
      await assertOwnsProperty(this.prisma, userId, dto.propertyId);
    }
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.project.delete({ where: { id } });
    return { success: true };
  }
}
