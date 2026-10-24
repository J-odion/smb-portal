import { Model, Types } from 'mongoose';
import { Product, InventoryLog } from '../schemas/index.js';
export declare class InventoryService {
    private productModel;
    private inventoryLogModel;
    constructor(productModel: Model<Product>, inventoryLogModel: Model<InventoryLog>);
    findAll(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, Product, {}, import("mongoose").DefaultSchemaOptions> & Product & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(tenantId: string, id: string): Promise<import("mongoose").Document<unknown, {}, Product, {}, import("mongoose").DefaultSchemaOptions> & Product & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    create(tenantId: string, data: {
        name: string;
        sku?: string;
        category?: string;
        price: number;
        stock_level?: number;
    }): Promise<import("mongoose").Document<unknown, {}, Product, {}, import("mongoose").DefaultSchemaOptions> & Product & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(tenantId: string, id: string, data: any): Promise<import("mongoose").Document<unknown, {}, Product, {}, import("mongoose").DefaultSchemaOptions> & Product & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    delete(tenantId: string, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
