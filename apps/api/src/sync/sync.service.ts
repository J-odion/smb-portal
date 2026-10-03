import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customer, Transaction } from '../schemas/index.js';

@Injectable()
export class SyncService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async syncOfflineData(tenantId: string, payload: any) {
    const results = {
      customersSynced: 0,
      transactionsSynced: 0,
      errors: [] as any[],
    };

    // 1. Sync Customers
    if (payload.customers && Array.isArray(payload.customers) && payload.customers.length > 0) {
      try {
        const customerOps = payload.customers.map((c: any) => ({
          updateOne: {
            filter: { tenant_id: tenantId, phone: c.phone },
            update: { $set: { name: c.name, phone: c.phone, whatsapp: c.whatsapp, address: c.address, tenant_id: tenantId } },
            upsert: true
          }
        }));
        const result = await this.customerModel.bulkWrite(customerOps, { ordered: false });
        results.customersSynced = result.upsertedCount + result.modifiedCount;
      } catch(err: any) {
        results.errors.push({ type: 'customers_bulk', error: err.message });
      }
    }

    // 2. Sync Transactions
    if (payload.transactions && Array.isArray(payload.transactions) && payload.transactions.length > 0) {
      try {
        const transactionOps = payload.transactions.map((txn: any) => {
          const offlineId = txn.id || txn.offline_id;
          return {
            updateOne: {
              filter: { tenant_id: tenantId, 'metadata.offline_id': offlineId },
              update: { 
                $setOnInsert: {
                  tenant_id: tenantId,
                  customer_id: txn.customer_id,
                  type: txn.type || 'SALE',
                  subtotal: txn.subtotal,
                  vat: txn.vat || 0,
                  total: txn.total,
                  status: txn.status || 'Pending',
                  metadata: { offline_id: offlineId, ...txn.metadata },
                  items: (txn.items && Array.isArray(txn.items)) ? txn.items.map((item: any) => ({
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    product_id: item.product_id,
                  })) : []
                }
              },
              upsert: true
            }
          };
        });
        
        const result = await this.transactionModel.bulkWrite(transactionOps, { ordered: false });
        // upsertedCount tracks genuinely new offline transactions inserted
        results.transactionsSynced = result.upsertedCount;
      } catch (err: any) {
        results.errors.push({ type: 'transactions_bulk', error: err.message });
      }
    }

    return results;
  }
}
