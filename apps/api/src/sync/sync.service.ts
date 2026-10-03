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
    if (payload.customers && Array.isArray(payload.customers)) {
      for (const customer of payload.customers) {
        try {
          const updateData = {
            name: customer.name,
            phone: customer.phone,
            whatsapp: customer.whatsapp,
            address: customer.address,
            tenant_id: tenantId,
          };
          
          // Use phone + tenant_id as the unique identifier to prevent duplicates
          // since mobile devices might not generate valid ObjectIds for new offline customers
          await this.customerModel.findOneAndUpdate(
            { tenant_id: tenantId, phone: customer.phone },
            { $set: updateData },
            { upsert: true, new: true }
          ).exec();
          
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
          // Use offline ID stored in metadata or the provided ID to prevent duplicate transactions
          const offlineId = txn.id || txn.offline_id;
          
          const existingTxn = await this.transactionModel.findOne({
            tenant_id: tenantId,
            'metadata.offline_id': offlineId
          }).exec();

          if (existingTxn) {
            // Already synced, skip to prevent duplicates
            continue;
          }

          const newTxn = await this.transactionModel.create({
            tenant_id: tenantId,
            customer_id: txn.customer_id,
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
            })) : [],
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
