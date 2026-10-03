import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, Customer, Product, InventoryLog } from '../schemas/index.js';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(InventoryLog.name) private inventoryLogModel: Model<InventoryLog>,
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

  async create(tenantId: string, data: { customer_id?: string; branch_id?: string; type?: string; subtotal: number; vat: number; total: number; items?: any[] }) {
    if (data.customer_id) {
      const validCustomer = await this.customerModel.findOne({ _id: data.customer_id }).exec();
      if (!validCustomer) {
        throw new BadRequestException('Invalid customer ID');
      }
    }

    let calculatedSubtotal = 0;
    const finalItems = [];
    const isRefund = data.type === 'REFUND';
    const inventoryLogs = [];
    const productOps = [];

    let productsMap = new Map();
    if (data.items && data.items.length > 0) {
      const productIds = data.items.map(item => item.product_id).filter(id => !!id);
      if (productIds.length > 0) {
        const products = await this.productModel.find({ _id: { $in: productIds } }).exec();
        productsMap = new Map(products.map(p => [p._id.toString(), p]));
      }
      
      for (const item of data.items) {
        let unit_price = item.unit_price;
        if (item.product_id) {
          const product = productsMap.get(item.product_id.toString());
          if (!product) {
            throw new BadRequestException(`Invalid product ID: ${item.product_id}`);
          }
          unit_price = product.price; // Server overrides client price to prevent fraud
          
          // Inventory stock calculation
          const quantityChange = isRefund ? item.quantity : -item.quantity;
          inventoryLogs.push({
            tenant_id: tenantId,
            product_id: item.product_id,
            branch_id: data.branch_id,
            quantity_change: quantityChange,
            reason: isRefund ? 'Customer Refund' : 'POS Sale'
          });
          
          productOps.push({
            updateOne: {
              filter: { _id: item.product_id },
              update: { $inc: { stock_level: quantityChange } }
            }
          });
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
      branch_id: data.branch_id,
      customer_id: data.customer_id,
      type: data.type || 'SALE',
      subtotal: calculatedSubtotal,
      vat: calculatedVat,
      total: calculatedTotal,
      items: finalItems,
    });

    if (inventoryLogs.length > 0) {
      const logsWithTxn = inventoryLogs.map(log => ({ ...log, transaction_id: transaction._id }));
      await this.inventoryLogModel.insertMany(logsWithTxn);
      if (productOps.length > 0) {
        await this.productModel.bulkWrite(productOps, { ordered: false });
      }
    }

    return transaction;
  }
}
