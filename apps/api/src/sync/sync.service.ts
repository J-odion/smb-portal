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
    const customerMap = new Map<string, Types.ObjectId>();
    if (payload.customers && Array.isArray(payload.customers) && payload.customers.length > 0) {
      try {
        const customerOps = payload.customers.map((c: any) => {
          const offlineId = c.id || c.offline_id;
          return {
            updateOne: {
              filter: { tenant_id: tenantId, phone: c.phone },
              update: {
                $set: {
                  name: c.name,
                  phone: c.phone,
                  whatsapp: c.whatsapp,
                  address: c.address,
                  tenant_id: tenantId,
                  ...(offlineId ? { 'metadata.offline_id': offlineId } : {}),
                },
              },
              upsert: true,
            },
          };
        });
        const result = await this.customerModel.bulkWrite(customerOps, { ordered: false });
        results.customersSynced = result.upsertedCount + result.modifiedCount;

        // Build mapping from offline ID and phone to real MongoDB ObjectId
        const phones = payload.customers.map((c: any) => c.phone).filter(Boolean);
        const offlineIds = payload.customers.map((c: any) => c.id || c.offline_id).filter(Boolean);
        
        const dbCustomers = await this.customerModel
          .find({
            tenant_id: tenantId,
            $or: [
              { phone: { $in: phones } },
              { 'metadata.offline_id': { $in: offlineIds } },
            ],
          })
          .select('_id phone metadata')
          .exec();

        for (const cust of dbCustomers) {
          if (cust.phone) customerMap.set(cust.phone, cust._id as Types.ObjectId);
          if (cust.metadata?.offline_id) customerMap.set(cust.metadata.offline_id, cust._id as Types.ObjectId);
        }
      } catch (err: any) {
        results.errors.push({ type: 'customers_bulk', error: err.message });
      }
    }

    // 2. Sync Transactions with Orphan Prevention
    if (payload.transactions && Array.isArray(payload.transactions) && payload.transactions.length > 0) {
      try {
        // Collect any explicit customer_ids that need database validation
        const candidateCustomerIds = payload.transactions
          .map((txn: any) => txn.customer_id)
          .filter((id: any) => id && typeof id === 'string' && Types.ObjectId.isValid(id) && !customerMap.has(id));

        if (candidateCustomerIds.length > 0) {
          const verifiedCustomers = await this.customerModel
            .find({ tenant_id: tenantId, _id: { $in: candidateCustomerIds } })
            .select('_id')
            .exec();
          for (const vc of verifiedCustomers) {
            customerMap.set(vc._id.toString(), vc._id as Types.ObjectId);
          }
        }

        const transactionOps = payload.transactions.map((txn: any) => {
          const offlineId = txn.id || txn.offline_id;

          // Resolve customer_id to guarantee no orphaned or non-existent references
          let resolvedCustomerId: Types.ObjectId | null = null;
          let unresolvedCustomerId: string | null = null;

          if (txn.customer_id) {
            const rawId = String(txn.customer_id);
            if (customerMap.has(rawId)) {
              resolvedCustomerId = customerMap.get(rawId)!;
            } else if (txn.customer_phone && customerMap.has(txn.customer_phone)) {
              resolvedCustomerId = customerMap.get(txn.customer_phone)!;
            } else {
              // Non-existent or unresolved offline ID
              unresolvedCustomerId = rawId;
            }
          }

          return {
            updateOne: {
              filter: { tenant_id: tenantId, 'metadata.offline_id': offlineId },
              update: { 
                $setOnInsert: {
                  tenant_id: tenantId,
                  customer_id: resolvedCustomerId,
                  type: txn.type || 'SALE',
                  subtotal: txn.subtotal,
                  vat: txn.vat || 0,
                  total: txn.total,
                  status: txn.status || 'Pending',
                  metadata: {
                    offline_id: offlineId,
                    ...(unresolvedCustomerId ? { unresolved_customer_id: unresolvedCustomerId } : {}),
                    ...txn.metadata,
                  },
                  items: (txn.items && Array.isArray(txn.items)) ? txn.items.map((item: any) => ({
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    product_id: item.product_id && Types.ObjectId.isValid(item.product_id) ? item.product_id : undefined,
                  })) : []
                }
              },
              upsert: true
            }
          };
        });
        
        const result = await this.transactionModel.bulkWrite(transactionOps, { ordered: false });
        results.transactionsSynced = result.upsertedCount;
      } catch (err: any) {
        results.errors.push({ type: 'transactions_bulk', error: err.message });
      }
    }

    return results;
  }
}
