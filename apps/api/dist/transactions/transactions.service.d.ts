import { Model } from 'mongoose';
import { Transaction, Customer, Product } from '../schemas/index.js';
export declare class TransactionsService {
    private transactionModel;
    private customerModel;
    private productModel;
    constructor(transactionModel: Model<Transaction>, customerModel: Model<Customer>, productModel: Model<Product>);
    findAll(tenantId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, Transaction, {}, import("mongoose").DefaultSchemaOptions> & Transaction & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(tenantId: string, data: {
        customer_id?: string;
        subtotal: number;
        vat: number;
        total: number;
        items?: any[];
    }): Promise<import("mongoose").Document<unknown, {}, Transaction, {}, import("mongoose").DefaultSchemaOptions> & Transaction & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
