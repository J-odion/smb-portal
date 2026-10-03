import { Model } from 'mongoose';
import { Customer, Transaction } from '../schemas/index.js';
export declare class SyncService {
    private customerModel;
    private transactionModel;
    constructor(customerModel: Model<Customer>, transactionModel: Model<Transaction>);
    syncOfflineData(tenantId: string, payload: any): Promise<{
        customersSynced: number;
        transactionsSynced: number;
        errors: any[];
    }>;
}
