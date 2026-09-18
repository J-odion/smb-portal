import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.transaction.findMany({
      where: { tenant_id: tenantId },
      include: {
        customer: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async create(tenantId: string, data: { customer_id: string; subtotal: number; vat: number; total: number; items: any[] }) {
    return this.prisma.transaction.create({
      data: {
        tenant_id: tenantId,
        customer_id: data.customer_id,
        subtotal: data.subtotal,
        vat: data.vat,
        total: data.total,
        items: {
          create: data.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })),
        },
      },
    });
  }
}
