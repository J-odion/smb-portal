import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Tenant,
  User,
  Branch,
  Customer,
  Product,
  Transaction,
  Payment,
  Staff,
  InventoryLog,
} from '../schemas/index.js';

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

@Injectable()
export class DataIntegrityService {
  private readonly logger = new Logger(DataIntegrityService.name);

  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<Tenant>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Branch.name) private branchModel: Model<Branch>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Staff.name) private staffModel: Model<Staff>,
    @InjectModel(InventoryLog.name) private inventoryLogModel: Model<InventoryLog>,
  ) {}

  /**
   * Performs a comprehensive database scan to detect any dangling or orphaned references.
   */
  async auditOrphanedData(tenantId?: string): Promise<IntegrityAuditReport> {
    const filter = tenantId ? { tenant_id: new Types.ObjectId(tenantId) } : {};
    const report: IntegrityAuditReport = {
      timestamp: new Date().toISOString(),
      isClean: true,
      totalOrphanedRecords: 0,
      anomalies: {
        orphanedTransactions: 0,
        orphanedPayments: 0,
        orphanedInventoryLogs: 0,
        orphanedStaffUsers: 0,
        orphanedTenantRecords: 0,
      },
      details: [],
    };

    // 1. Audit Transactions referencing non-existent Customers
    const txnsWithCustomer = await this.transactionModel
      .find({ ...filter, customer_id: { $ne: null } })
      .select('_id customer_id')
      .lean();

    if (txnsWithCustomer.length > 0) {
      const customerIds = [...new Set(txnsWithCustomer.map((t) => t.customer_id?.toString()).filter((id): id is string => Boolean(id)))];
      const existingCustomers = await this.customerModel
        .find({ _id: { $in: customerIds } } as any)
        .select('_id')
        .lean();
      const existingCustSet = new Set(existingCustomers.map((c: any) => c._id.toString()));

      const orphanedTxns = txnsWithCustomer.filter(
        (t) => t.customer_id && !existingCustSet.has(t.customer_id.toString()),
      );

      if (orphanedTxns.length > 0) {
        report.anomalies.orphanedTransactions = orphanedTxns.length;
        report.totalOrphanedRecords += orphanedTxns.length;
        report.details.push({
          type: 'TRANSACTION_ORPHAN_CUSTOMER',
          description: `Transactions pointing to non-existent customer IDs`,
          sampleIds: orphanedTxns.slice(0, 10).map((t) => t._id.toString()),
        });
      }
    }

    // 2. Audit Payments referencing non-existent Transactions
    const payments = await this.paymentModel.find(filter).select('_id transaction_id').lean();
    if (payments.length > 0) {
      const txnIds = [...new Set(payments.map((p) => p.transaction_id?.toString()).filter((id): id is string => Boolean(id)))];
      const existingTxns = await this.transactionModel
        .find({ _id: { $in: txnIds } } as any)
        .select('_id')
        .lean();
      const existingTxnSet = new Set(existingTxns.map((t: any) => t._id.toString()));

      const orphanedPayments = payments.filter(
        (p) => !p.transaction_id || !existingTxnSet.has(p.transaction_id.toString()),
      );

      if (orphanedPayments.length > 0) {
        report.anomalies.orphanedPayments = orphanedPayments.length;
        report.totalOrphanedRecords += orphanedPayments.length;
        report.details.push({
          type: 'PAYMENT_ORPHAN_TRANSACTION',
          description: `Payments pointing to non-existent transaction IDs`,
          sampleIds: orphanedPayments.slice(0, 10).map((p) => p._id.toString()),
        });
      }
    }

    // 3. Audit InventoryLogs referencing non-existent Products
    const logs = await this.inventoryLogModel.find(filter).select('_id product_id').lean();
    if (logs.length > 0) {
      const prodIds = [...new Set(logs.map((l) => l.product_id?.toString()).filter((id): id is string => Boolean(id)))];
      const existingProds = await this.productModel
        .find({ _id: { $in: prodIds } } as any)
        .select('_id')
        .lean();
      const existingProdSet = new Set(existingProds.map((p: any) => p._id.toString()));

      const orphanedLogs = logs.filter((l) => !l.product_id || !existingProdSet.has(l.product_id.toString()));
      if (orphanedLogs.length > 0) {
        report.anomalies.orphanedInventoryLogs = orphanedLogs.length;
        report.totalOrphanedRecords += orphanedLogs.length;
        report.details.push({
          type: 'INVENTORY_LOG_ORPHAN_PRODUCT',
          description: `Inventory logs referencing deleted products`,
          sampleIds: orphanedLogs.slice(0, 10).map((l) => l._id.toString()),
        });
      }
    }

    // 4. Audit Staff referencing non-existent Users
    const staffWithUser = await this.staffModel.find({ ...filter, user_id: { $ne: null } }).select('_id user_id').lean();
    if (staffWithUser.length > 0) {
      const userIds = [...new Set(staffWithUser.map((s) => s.user_id?.toString()).filter((id): id is string => Boolean(id)))];
      const existingUsers = await this.userModel.find({ _id: { $in: userIds } } as any).select('_id').lean();
      const existingUserSet = new Set(existingUsers.map((u: any) => u._id.toString()));

      const orphanedStaff = staffWithUser.filter(
        (s) => s.user_id && !existingUserSet.has(s.user_id.toString()),
      );

      if (orphanedStaff.length > 0) {
        report.anomalies.orphanedStaffUsers = orphanedStaff.length;
        report.totalOrphanedRecords += orphanedStaff.length;
        report.details.push({
          type: 'STAFF_ORPHAN_USER',
          description: `Staff records referencing deleted user accounts`,
          sampleIds: orphanedStaff.slice(0, 10).map((s) => s._id.toString()),
        });
      }
    }

    // 5. Audit records without valid Tenant (when running global audit)
    if (!tenantId) {
      const existingTenants = await this.tenantModel.find().select('_id').lean();
      const existingTenantSet = new Set(existingTenants.map((t) => t._id.toString()));

      const checkModels = [
        { name: 'Customer', model: this.customerModel },
        { name: 'Transaction', model: this.transactionModel },
        { name: 'User', model: this.userModel },
      ];

      for (const { name, model } of checkModels) {
        const records = await (model as any).find().select('_id tenant_id').lean();
        const orphaned = records.filter((r: any) => !r.tenant_id || !existingTenantSet.has(r.tenant_id.toString()));
        if (orphaned.length > 0) {
          report.anomalies.orphanedTenantRecords += orphaned.length;
          report.totalOrphanedRecords += orphaned.length;
          report.details.push({
            type: `${name.toUpperCase()}_ORPHAN_TENANT`,
            description: `${name} records referencing non-existent tenants`,
            sampleIds: orphaned.slice(0, 10).map((r: any) => r._id.toString()),
          });
        }
      }
    }

    report.isClean = report.totalOrphanedRecords === 0;
    return report;
  }

  /**
   * Safely resolves or cleans orphaned data across the database.
   */
  async cleanupOrphanedData(tenantId?: string): Promise<{ cleanedCount: number; summary: Record<string, number> }> {
    const filter = tenantId ? { tenant_id: new Types.ObjectId(tenantId) } : {};
    const summary: Record<string, number> = {
      transactionsDisassociated: 0,
      paymentsPurged: 0,
      staffUsersDisassociated: 0,
      logsCleaned: 0,
    };

    // 1. Transactions with dead customer_id -> safely nullify and preserve in metadata
    const txns = await this.transactionModel.find({ ...filter, customer_id: { $ne: null } }).select('_id customer_id');
    if (txns.length > 0) {
      const custIds = [...new Set(txns.map((t) => t.customer_id?.toString()).filter((id): id is string => Boolean(id)))];
      const validCusts = await this.customerModel.find({ _id: { $in: custIds } } as any).select('_id').lean();
      const validSet = new Set(validCusts.map((c: any) => c._id.toString()));

      for (const txn of txns) {
        if (txn.customer_id && !validSet.has(txn.customer_id.toString())) {
          await this.transactionModel.updateOne(
            { _id: txn._id },
            {
              $set: {
                'metadata.cleaned_orphan_customer_id': txn.customer_id.toString(),
              },
              $unset: { customer_id: 1 },
            },
          );
          summary.transactionsDisassociated++;
        }
      }
    }

    // 2. Payments with dead transaction_id -> delete dead payments
    const payments = await this.paymentModel.find(filter).select('_id transaction_id');
    if (payments.length > 0) {
      const txnIds = [...new Set(payments.map((p) => p.transaction_id?.toString()).filter((id): id is string => Boolean(id)))];
      const validTxns = await this.transactionModel.find({ _id: { $in: txnIds } } as any).select('_id').lean();
      const validTxnSet = new Set(validTxns.map((t: any) => t._id.toString()));

      const deadPaymentIds = payments
        .filter((p) => !p.transaction_id || !validTxnSet.has(p.transaction_id.toString()))
        .map((p) => p._id);

      if (deadPaymentIds.length > 0) {
        await this.paymentModel.deleteMany({ _id: { $in: deadPaymentIds } });
        summary.paymentsPurged += deadPaymentIds.length;
      }
    }

    // 3. Staff with dead user_id -> unset user_id
    const staff = await this.staffModel.find({ ...filter, user_id: { $ne: null } }).select('_id user_id');
    if (staff.length > 0) {
      const userIds = [...new Set(staff.map((s) => s.user_id?.toString()).filter((id): id is string => Boolean(id)))];
      const validUsers = await this.userModel.find({ _id: { $in: userIds } } as any).select('_id').lean();
      const validUserSet = new Set(validUsers.map((u: any) => u._id.toString()));

      for (const s of staff) {
        if (s.user_id && !validUserSet.has(s.user_id.toString())) {
          await this.staffModel.updateOne({ _id: s._id }, { $unset: { user_id: 1 } });
          summary.staffUsersDisassociated++;
        }
      }
    }

    const cleanedCount = Object.values(summary).reduce((a, b) => a + b, 0);
    this.logger.log(`Data integrity cleanup completed. Total records processed/fixed: ${cleanedCount}`);
    return { cleanedCount, summary };
  }
}
