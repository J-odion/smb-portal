import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from '../schemas/index.js';

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private customerModel: Model<Customer>) {}

  async findAll(tenantId: string) {
    return this.customerModel.find({ tenant_id: tenantId }).sort({ created_at: -1 }).exec();
  }

  async create(tenantId: string, data: { name: string; phone: string; whatsapp?: string; address?: string; notes?: string; whatsapp_consent?: boolean }) {
    return this.customerModel.create({
      tenant_id: tenantId,
      ...data,
    });
  }
}
