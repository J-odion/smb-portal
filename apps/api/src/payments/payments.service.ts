import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, Transaction } from '../schemas/index.js';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async findAll(tenantId: string) {
    return this.paymentModel.find({ tenant_id: tenantId }).populate('transaction_id').sort({ created_at: -1 }).exec();
  }

  async create(tenantId: string, data: { transaction_id: string; amount: number; method: string; staff_id?: string }) {
    const transaction = await this.transactionModel.findOne({
      _id: data.transaction_id,
      tenant_id: tenantId
    }).exec();

    if (!transaction) {
      throw new BadRequestException('Transaction not found or access denied');
    }

    return this.paymentModel.create({
      tenant_id: tenantId,
      ...data,
    });
  }

  async createCheckoutSession(tenantId: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', { apiVersion: '2025-02-24.acacia' });
    
    // In production, we create a real session. For MVP, we'll return a mock URL
    // that just routes back to dashboard if Stripe is not fully configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return { url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?upgrade=success` };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'ngn',
            product_data: { name: 'SMB Portal PRO' },
            unit_amount: 1500000, // ₦15,000.00
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?upgrade=success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/settings`,
      client_reference_id: tenantId,
    });

    return { url: session.url };
  }

  async handleStripeWebhook(payload: any, signature: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', { apiVersion: '2025-02-24.acacia' });
    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock');
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const tenantId = session.client_reference_id;
      
      const now = new Date();
      now.setFullYear(now.getFullYear() + 1); // +1 year
      
      // Update tenant
      const { Tenant } = (await import('../schemas/index.js'));
      await this.paymentModel.db.model(Tenant.name).findByIdAndUpdate(tenantId, {
        subscription_status: 'ACTIVE',
        subscription_tier: 'PRO',
        subscription_ends_at: now,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
      });
    }

    return { received: true };
  }
}
