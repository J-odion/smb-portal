import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.staff.findMany({
      where: { tenant_id: tenantId },
    });
  }

  async create(tenantId: string, data: { name: string; phone: string; pay_type: string; flat_amount?: number; commission_percent?: number }) {
    return this.prisma.staff.create({
      data: {
        tenant_id: tenantId,
        ...data,
      },
    });
  }
}
