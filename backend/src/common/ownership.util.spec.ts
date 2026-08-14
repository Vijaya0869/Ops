import { BadRequestException, ForbiddenException } from '@nestjs/common';
import {
  assertOwnsDeal,
  assertOwnsLender,
  assertOwnsProject,
  assertOwnsProperty,
  assertOwnsTenant,
} from './ownership.util';
import { PrismaService } from '../prisma/prisma.service';

// Each case exercises the same guard against a different Prisma model to
// prove the ownership check is actually applied everywhere it's wired up —
// a broken check here means one user's data leaking into another's request.
const cases: {
  label: string;
  assertFn: (
    prisma: PrismaService,
    userId: string,
    id: string,
  ) => Promise<void>;
  model: 'property' | 'deal' | 'lender' | 'project' | 'tenant';
}[] = [
  { label: 'Property', assertFn: assertOwnsProperty, model: 'property' },
  { label: 'Deal', assertFn: assertOwnsDeal, model: 'deal' },
  { label: 'Lender', assertFn: assertOwnsLender, model: 'lender' },
  { label: 'Project', assertFn: assertOwnsProject, model: 'project' },
  { label: 'Tenant', assertFn: assertOwnsTenant, model: 'tenant' },
];

function mockPrisma(findUniqueResult: unknown, model: string) {
  return {
    [model]: {
      findUnique: jest.fn().mockResolvedValue(findUniqueResult),
    },
  } as unknown as PrismaService;
}

describe('ownership.util', () => {
  for (const { label, assertFn, model } of cases) {
    describe(`assertOwns${label}`, () => {
      it('resolves without throwing when the record belongs to the user', async () => {
        const prisma = mockPrisma({ id: 'record-1', userId: 'user-1' }, model);
        await expect(assertFn(prisma, 'user-1', 'record-1')).resolves.toBeUndefined();
      });

      it('throws BadRequestException when the record does not exist', async () => {
        const prisma = mockPrisma(null, model);
        await expect(assertFn(prisma, 'user-1', 'missing-id')).rejects.toThrow(
          BadRequestException,
        );
      });

      it('throws ForbiddenException when the record belongs to a different user', async () => {
        const prisma = mockPrisma({ id: 'record-1', userId: 'someone-else' }, model);
        await expect(assertFn(prisma, 'user-1', 'record-1')).rejects.toThrow(
          ForbiddenException,
        );
      });
    });
  }
});
