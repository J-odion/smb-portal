import { Model } from 'mongoose';
import { Customer, Transaction, TransactionItem } from '../schemas/index.js';
export declare class SyncService {
    private customerModel;
    private transactionModel;
    private transactionItemModel;
    constructor(customerModel: Model<Customer>, transactionModel: Model<Transaction>, transactionItemModel: Model<TransactionItem>);
    syncOfflineData(tenantId: string, payload: any): Promise<{
        customersSynced: number;
        transactionsSynced: number;
        errors: any[];
    }>;
}
