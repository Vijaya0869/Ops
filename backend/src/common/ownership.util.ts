import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function assertOwns(
  label: string,
  record: { userId: string } | null,
  userId: string,
) {
  if (!record) throw new BadRequestException(`${label} not found`);
  if (record.userId !== userId) throw new ForbiddenException();
}

export async function assertOwnsProperty(
  prisma: PrismaService,
  userId: string,
  propertyId: string,
) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });
  assertOwns('Property', property, userId);
}

export async function assertOwnsDeal(
  prisma: PrismaService,
  userId: string,
  dealId: string,
) {
  const deal = await prisma.deal.findUnique({ where: { id: dealId } });
  assertOwns('Deal', deal, userId);
}

export async function assertOwnsLender(
  prisma: PrismaService,
  userId: string,
  lenderId: string,
) {
  const lender = await prisma.lender.findUnique({ where: { id: lenderId } });
  assertOwns('Lender', lender, userId);
}

export async function assertOwnsProject(
  prisma: PrismaService,
  userId: string,
  projectId: string,
) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  assertOwns('Project', project, userId);
}

export async function assertOwnsTenant(
  prisma: PrismaService,
  userId: string,
  tenantId: string,
) {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  assertOwns('Tenant', tenant, userId);
}
