import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.expense.findMany({
      where: { tenant_id: tenantId },
      orderBy: { date: 'desc' },
    });
  }

  async create(tenantId: string, data: { category: string; amount: number; note?: string }) {
    return this.prisma.expense.create({
      data: {
        tenant_id: tenantId,
        ...data,
      },
    });
  }
}
