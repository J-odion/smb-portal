import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.payment.findMany({
      where: { tenant_id: tenantId },
      include: {
        transaction: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async create(tenantId: string, data: { transaction_id: string; amount: number; method: string; staff_id?: string }) {
    // Basic validation to ensure transaction belongs to tenant
    const transaction = await this.prisma.transaction.findFirst({
      where: { id: data.transaction_id, tenant_id: tenantId }
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found or access denied');
    }

    return this.prisma.payment.create({
      data: {
        tenant_id: tenantId,
        ...data,
      },
    });
  }
}
