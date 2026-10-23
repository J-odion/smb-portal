import { Model } from 'mongoose';
import { Tenant, User, Branch, Customer, Product, Transaction, Payment, Staff, InventoryLog } from '../schemas/index.js';
export interface IntegrityAuditReport {
    timestamp: string;
    isClean: boolean;
    totalOrphanedRecords: number;
    anomalies: {
        orphanedTransactions: number;
        orphanedPayments: number;
        orphanedInventoryLogs: number;
        orphanedStaffUsers: number;
        orphanedTenantRecords: number;
    };
    details: {
        type: string;
        description: string;
        sampleIds: string[];
    }[];
}
export declare class DataIntegrityService {
    private tenantModel;
    private userModel;
    private branchModel;
    private customerModel;
    private productModel;
    private transactionModel;
    private paymentModel;
    private staffModel;
    private inventoryLogModel;
    private readonly logger;
    constructor(tenantModel: Model<Tenant>, userModel: Model<User>, branchModel: Model<Branch>, customerModel: Model<Customer>, productModel: Model<Product>, transactionModel: Model<Transaction>, paymentModel: Model<Payment>, staffModel: Model<Staff>, inventoryLogModel: Model<InventoryLog>);
    auditOrphanedData(tenantId?: string): Promise<IntegrityAuditReport>;
    cleanupOrphanedData(tenantId?: string): Promise<{
        cleanedCount: number;
        summary: Record<string, number>;
    }>;
}
