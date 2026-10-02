import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionItem } from '../schemas/index.js';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(TransactionItem.name) private transactionItemModel: Model<TransactionItem>,
  ) {}

  async findAll(tenantId: string) {
    return this.transactionModel.find({ tenant_id: tenantId }).populate('customer_id').sort({ created_at: -1 }).exec();
  }

  async create(tenantId: string, data: { customer_id: string; subtotal: number; vat: number; total: number; items: any[] }) {
    const transaction = await this.transactionModel.create({
      tenant_id: tenantId,
      customer_id: data.customer_id,
      subtotal: data.subtotal,
      vat: data.vat,
      total: data.total,
    });

    if (data.items && data.items.length > 0) {
      const itemsToInsert = data.items.map(item => ({
        transaction_id: transaction._id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));
      await this.transactionItemModel.insertMany(itemsToInsert);
    }

    return transaction;
  }
}
