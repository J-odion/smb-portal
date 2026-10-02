import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from '../schemas/index.js';

@Injectable()
export class ExpensesService {
  constructor(@InjectModel(Expense.name) private expenseModel: Model<Expense>) {}

  async findAll(tenantId: string) {
    return this.expenseModel.find({ tenant_id: tenantId }).sort({ date: -1 }).exec();
  }

  async create(tenantId: string, data: { category: string; amount: number; note?: string }) {
    return this.expenseModel.create({
      tenant_id: tenantId,
      ...data,
    });
  }
}
