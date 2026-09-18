import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SyncService {
  constructor(private prisma: PrismaService) {}

  async syncOfflineData(tenantId: string, payload: any) {
    const results = {
      customersSynced: 0,
      transactionsSynced: 0,
      errors: [] as any[],
    };

    // 1. Sync Customers
    if (payload.customers && Array.isArray(payload.customers)) {
      for (const customer of payload.customers) {
        try {
          await this.prisma.customer.upsert({
            where: { id: customer.id || 'new-uuid-placeholder' }, // In a real app we'd use a robust offline UUID strategy
            update: {
              name: customer.name,
              phone: customer.phone,
              whatsapp: customer.whatsapp,
              address: customer.address,
            },
            create: {
              tenant_id: tenantId,
              name: customer.name,
              phone: customer.phone,
              whatsapp: customer.whatsapp,
              address: customer.address,
            },
          });
          results.customersSynced++;
        } catch (err: any) {
          results.errors.push({ type: 'customer', id: customer.id, error: err.message });
        }
      }
    }

    // 2. Sync Transactions
    if (payload.transactions && Array.isArray(payload.transactions)) {
      for (const txn of payload.transactions) {
        try {
          // If the offline transaction doesn't exist, create it
          await this.prisma.transaction.create({
            data: {
              tenant_id: tenantId,
              customer_id: txn.customer_id,
              subtotal: txn.subtotal,
              vat: txn.vat || 0,
              total: txn.total,
              status: txn.status || 'Pending',
              items: {
                create: txn.items?.map((item: any) => ({
                  description: item.description,
                  quantity: item.quantity,
                  unit_price: item.unit_price,
                })) || [],
              },
            },
          });
          results.transactionsSynced++;
        } catch (err: any) {
          results.errors.push({ type: 'transaction', id: txn.id, error: err.message });
        }
      }
    }

    return results;
  }
}
