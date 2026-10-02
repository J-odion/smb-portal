import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Staff } from '../schemas/index.js';

@Injectable()
export class StaffService {
  constructor(@InjectModel(Staff.name) private staffModel: Model<Staff>) {}

  async findAll(tenantId: string) {
    return this.staffModel.find({ tenant_id: tenantId }).exec();
  }

  async create(tenantId: string, data: { name: string; phone: string; pay_type: string; flat_amount?: number; commission_percent?: number }) {
    return this.staffModel.create({
      tenant_id: tenantId,
      ...data,
    });
  }
}
