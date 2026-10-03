import { Model } from 'mongoose';
import { Transaction, TransactionItem } from '../schemas/index.js';
export declare class TransactionsService {
    private transactionModel;
    private transactionItemModel;
    constructor(transactionModel: Model<Transaction>, transactionItemModel: Model<TransactionItem>);
    findAll(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, Transaction, {}, import("mongoose").DefaultSchemaOptions> & Transaction & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(tenantId: string, data: {
        customer_id: string;
        subtotal: number;
        vat: number;
        total: number;
        items: any[];
    }): Promise<import("mongoose").Document<unknown, {}, Transaction, {}, import("mongoose").DefaultSchemaOptions> & Transaction & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
