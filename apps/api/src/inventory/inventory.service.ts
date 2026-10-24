import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, InventoryLog } from '../schemas/index.js';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(InventoryLog.name) private inventoryLogModel: Model<InventoryLog>,
  ) {}

  async findAll(tenantId: string) {
    return this.productModel
      .find({ tenant_id: tenantId })
      .sort({ created_at: -1 })
      .exec();
  }

  async findOne(tenantId: string, id: string) {
    const product = await this.productModel.findOne({ _id: id, tenant_id: tenantId }).exec();
    if (!product) {
      throw new NotFoundException('Inventory item not found');
    }
    return product;
  }

  async create(tenantId: string, data: { name: string; sku?: string; category?: string; price: number; stock_level?: number }) {
    const sku = data.sku?.trim() || `SKU-${Date.now().toString().slice(-6)}`;
    const price = Number(data.price) || 0;
    const stock_level = Number(data.stock_level) || 0;

    const product = await this.productModel.create({
      tenant_id: new Types.ObjectId(tenantId),
      name: data.name,
      sku,
      category: data.category || 'General',
      price,
      stock_level,
    });

    if (stock_level > 0) {
      try {
        await this.inventoryLogModel.create({
          tenant_id: new Types.ObjectId(tenantId),
          product_id: product._id,
          quantity_change: stock_level,
          reason: 'Initial stock intake',
        });
      } catch (logErr) {
        console.warn('Could not record initial inventory log:', logErr);
      }
    }

    return product;
  }

  async update(tenantId: string, id: string, data: any) {
    const updateData: any = { ...data };
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.stock_level !== undefined) updateData.stock_level = Number(updateData.stock_level);

    const updated = await this.productModel.findOneAndUpdate(
      { _id: id, tenant_id: tenantId },
      { $set: updateData },
      { new: true },
    ).exec();

    if (!updated) {
      throw new NotFoundException('Inventory item not found');
    }
    return updated;
  }

  async delete(tenantId: string, id: string) {
    const deleted = await this.productModel.findOneAndDelete({
      _id: id,
      tenant_id: tenantId,
    }).exec();

    if (!deleted) {
      throw new NotFoundException('Inventory item not found');
    }
    return { success: true, message: 'Item deleted successfully' };
  }
}
