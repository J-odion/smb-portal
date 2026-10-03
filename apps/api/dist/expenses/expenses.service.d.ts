import { Model } from 'mongoose';
import { Expense } from '../schemas/index.js';
export declare class ExpensesService {
    private expenseModel;
    constructor(expenseModel: Model<Expense>);
    findAll(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, Expense, {}, import("mongoose").DefaultSchemaOptions> & Expense & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(tenantId: string, data: {
        category: string;
        amount: number;
        note?: string;
    }): Promise<import("mongoose").Document<unknown, {}, Expense, {}, import("mongoose").DefaultSchemaOptions> & Expense & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
