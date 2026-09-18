import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.customer.findMany({
      where: { tenant_id: tenantId },
      orderBy: { created_at: 'desc' },
    });
  }

  async create(tenantId: string, data: { name: string; phone: string; whatsapp?: string; address?: string; notes?: string; whatsapp_consent?: boolean }) {
    return this.prisma.customer.create({
      data: {
        tenant_id: tenantId,
        ...data,
      },
    });
  }
}
