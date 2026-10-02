import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, User } from '../schemas/index.js';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<Tenant>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async getGlobalMetrics() {
    const totalTenants = await this.tenantModel.countDocuments();
    const activeUsers = await this.userModel.countDocuments();
    
    // Simulate server load for MVP dashboard
    const serverLoad = Math.floor(Math.random() * 40) + 20;

    return {
      totalTenants,
      activeUsers,
      serverLoad,
      openTickets: 24, // Mocked for MVP
    };
  }

  async getAllTenants() {
    return this.tenantModel.find().sort({ created_at: -1 }).exec();
  }

  async suspendTenant(tenantId: string) {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) throw new NotFoundException('Tenant not found');

    tenant.subscription_status = 'SUSPENDED';
    await tenant.save();

    return { message: 'Tenant suspended successfully', tenant };
  }

  async broadcastMessage(subject: string, message: string) {
    // In a real app, this would use a mailer service (e.g. AWS SES or SendGrid)
    // to queue emails to all users with role 'OWNER'
    
    const owners = await this.userModel.find({ role: 'OWNER' }).select('email').exec();
    
    console.log(`[SYSTEM BROADCAST] Sending "${subject}" to ${owners.length} tenant owners.`);
    
    return {
      success: true,
      recipientsCount: owners.length,
      message: 'Broadcast dispatched to queue'
    };
  }

  async overrideSubscription(tenantId: string, timeline: '1Y' | '2Y' | 'LIFETIME') {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const now = new Date();
    let endsAt = new Date();

    if (timeline === '1Y') {
      endsAt.setFullYear(now.getFullYear() + 1);
    } else if (timeline === '2Y') {
      endsAt.setFullYear(now.getFullYear() + 2);
    } else if (timeline === 'LIFETIME') {
      endsAt.setFullYear(now.getFullYear() + 100); // effectively lifetime
    }

    tenant.subscription_status = 'ACTIVE';
    tenant.subscription_tier = 'PRO'; // Give them the top tier
    tenant.subscription_ends_at = endsAt;
    
    await tenant.save();

    return { message: `Subscription overridden for ${timeline}`, tenant };
  }
}
