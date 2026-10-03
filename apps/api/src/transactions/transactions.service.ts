import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, Customer, Product } from '../schemas/index.js';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(tenantId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.transactionModel
        .find({ tenant_id: tenantId })
        .populate('customer_id')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.transactionModel.countDocuments({ tenant_id: tenantId }).exec()
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async create(tenantId: string, data: { customer_id?: string; subtotal: number; vat: number; total: number; items?: any[] }) {
    if (data.customer_id) {
      const validCustomer = await this.customerModel.findOne({ _id: data.customer_id }).exec();
      if (!validCustomer) {
        throw new BadRequestException('Invalid customer ID');
      }
    }

    let calculatedSubtotal = 0;
    const finalItems = [];

    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        let unit_price = item.unit_price;
        if (item.product_id) {
          const product = await this.productModel.findOne({ _id: item.product_id }).exec();
          if (!product) {
            throw new BadRequestException(`Invalid product ID: ${item.product_id}`);
          }
          unit_price = product.price; // Server overrides client price to prevent fraud
        }
        calculatedSubtotal += (item.quantity * unit_price);
        finalItems.push({
          description: item.description,
          quantity: item.quantity,
          unit_price: unit_price,
          product_id: item.product_id,
        });
      }
    } else {
      calculatedSubtotal = data.subtotal;
    }

    // Basic server-side total validation/recalculation
    const calculatedVat = data.vat; // Could be dynamic based on settings
    const calculatedTotal = calculatedSubtotal + calculatedVat;

    const transaction = await this.transactionModel.create({
      tenant_id: tenantId,
      customer_id: data.customer_id,
      subtotal: calculatedSubtotal,
      vat: calculatedVat,
      total: calculatedTotal,
      items: finalItems,
    });

    return transaction;
  }
}
