import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, User } from '../schemas/index.js';

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<Tenant>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getProfile(tenantId: string) {
    const tenant = await this.tenantModel.findById(tenantId).exec();
    const users = await this.userModel.find({ tenant_id: tenantId }).select('id email role').exec();
    if (!tenant) throw new Error('Tenant not found');
    return { ...tenant.toObject(), users };
  }

  async updateIndustry(tenantId: string, industry: string) {
    return this.tenantModel.findByIdAndUpdate(tenantId, { industry }, { new: true }).exec();
  }

  async updateSubscription(tenantId: string, tier: string) {
    return this.tenantModel.findByIdAndUpdate(tenantId, { subscription_tier: tier }, { new: true }).exec();
  }

  async inviteUser(tenantId: string, email: string, role: string) {
    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) {
      throw new Error('User already exists in the system.');
    }
    
    const crypto = await import('crypto');
    const bcrypt = await import('bcrypt');
    const tempPassword = crypto.randomBytes(16).toString('hex');
    const password_hash = await bcrypt.hash(tempPassword, 10);

    // In a real app we'd send an email with a setup link instead of a default password
    return this.userModel.create({
      email,
      password_hash, 
      role,
      tenant_id: tenantId
    });
  }

  async removeUser(tenantId: string, userId: string) {
    const user = await this.userModel.findOne({ _id: userId, tenant_id: tenantId }).exec();
    if (!user) throw new Error('User not found in your tenant');
    if (user.role === 'OWNER') throw new Error('Cannot remove the tenant owner');
    
    return this.userModel.findByIdAndDelete(userId).exec();
  }
}

