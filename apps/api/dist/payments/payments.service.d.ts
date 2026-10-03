import { Model } from 'mongoose';
import { Payment, Transaction } from '../schemas/index.js';
export declare class PaymentsService {
    private paymentModel;
    private transactionModel;
    constructor(paymentModel: Model<Payment>, transactionModel: Model<Transaction>);
    findAll(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, Payment, {}, import("mongoose").DefaultSchemaOptions> & Payment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(tenantId: string, data: {
        transaction_id: string;
        amount: number;
        method: string;
        staff_id?: string;
    }): Promise<import("mongoose").Document<unknown, {}, Payment, {}, import("mongoose").DefaultSchemaOptions> & Payment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    createCheckoutSession(tenantId: string): Promise<{
        url: string | null;
    }>;
    handleStripeWebhook(payload: any, signature: string): Promise<{
        received: boolean;
    }>;
}
