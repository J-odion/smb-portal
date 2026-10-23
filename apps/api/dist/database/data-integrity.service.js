"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DataIntegrityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataIntegrityService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const index_js_1 = require("../schemas/index.js");
let DataIntegrityService = DataIntegrityService_1 = class DataIntegrityService {
    tenantModel;
    userModel;
    branchModel;
    customerModel;
    productModel;
    transactionModel;
    paymentModel;
    staffModel;
    inventoryLogModel;
    logger = new common_1.Logger(DataIntegrityService_1.name);
    constructor(tenantModel, userModel, branchModel, customerModel, productModel, transactionModel, paymentModel, staffModel, inventoryLogModel) {
        this.tenantModel = tenantModel;
        this.userModel = userModel;
        this.branchModel = branchModel;
        this.customerModel = customerModel;
        this.productModel = productModel;
        this.transactionModel = transactionModel;
        this.paymentModel = paymentModel;
        this.staffModel = staffModel;
        this.inventoryLogModel = inventoryLogModel;
    }
    async auditOrphanedData(tenantId) {
        const filter = tenantId ? { tenant_id: new mongoose_2.Types.ObjectId(tenantId) } : {};
        const report = {
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
        const txnsWithCustomer = await this.transactionModel
            .find({ ...filter, customer_id: { $ne: null } })
            .select('_id customer_id')
            .lean();
        if (txnsWithCustomer.length > 0) {
            const customerIds = [...new Set(txnsWithCustomer.map((t) => t.customer_id?.toString()).filter((id) => Boolean(id)))];
            const existingCustomers = await this.customerModel
                .find({ _id: { $in: customerIds } })
                .select('_id')
                .lean();
            const existingCustSet = new Set(existingCustomers.map((c) => c._id.toString()));
            const orphanedTxns = txnsWithCustomer.filter((t) => t.customer_id && !existingCustSet.has(t.customer_id.toString()));
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
        const payments = await this.paymentModel.find(filter).select('_id transaction_id').lean();
        if (payments.length > 0) {
            const txnIds = [...new Set(payments.map((p) => p.transaction_id?.toString()).filter((id) => Boolean(id)))];
            const existingTxns = await this.transactionModel
                .find({ _id: { $in: txnIds } })
                .select('_id')
                .lean();
            const existingTxnSet = new Set(existingTxns.map((t) => t._id.toString()));
            const orphanedPayments = payments.filter((p) => !p.transaction_id || !existingTxnSet.has(p.transaction_id.toString()));
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
        const logs = await this.inventoryLogModel.find(filter).select('_id product_id').lean();
        if (logs.length > 0) {
            const prodIds = [...new Set(logs.map((l) => l.product_id?.toString()).filter((id) => Boolean(id)))];
            const existingProds = await this.productModel
                .find({ _id: { $in: prodIds } })
                .select('_id')
                .lean();
            const existingProdSet = new Set(existingProds.map((p) => p._id.toString()));
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
        const staffWithUser = await this.staffModel.find({ ...filter, user_id: { $ne: null } }).select('_id user_id').lean();
        if (staffWithUser.length > 0) {
            const userIds = [...new Set(staffWithUser.map((s) => s.user_id?.toString()).filter((id) => Boolean(id)))];
            const existingUsers = await this.userModel.find({ _id: { $in: userIds } }).select('_id').lean();
            const existingUserSet = new Set(existingUsers.map((u) => u._id.toString()));
            const orphanedStaff = staffWithUser.filter((s) => s.user_id && !existingUserSet.has(s.user_id.toString()));
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
        if (!tenantId) {
            const existingTenants = await this.tenantModel.find().select('_id').lean();
            const existingTenantSet = new Set(existingTenants.map((t) => t._id.toString()));
            const checkModels = [
                { name: 'Customer', model: this.customerModel },
                { name: 'Transaction', model: this.transactionModel },
                { name: 'User', model: this.userModel },
            ];
            for (const { name, model } of checkModels) {
                const records = await model.find().select('_id tenant_id').lean();
                const orphaned = records.filter((r) => !r.tenant_id || !existingTenantSet.has(r.tenant_id.toString()));
                if (orphaned.length > 0) {
                    report.anomalies.orphanedTenantRecords += orphaned.length;
                    report.totalOrphanedRecords += orphaned.length;
                    report.details.push({
                        type: `${name.toUpperCase()}_ORPHAN_TENANT`,
                        description: `${name} records referencing non-existent tenants`,
                        sampleIds: orphaned.slice(0, 10).map((r) => r._id.toString()),
                    });
                }
            }
        }
        report.isClean = report.totalOrphanedRecords === 0;
        return report;
    }
    async cleanupOrphanedData(tenantId) {
        const filter = tenantId ? { tenant_id: new mongoose_2.Types.ObjectId(tenantId) } : {};
        const summary = {
            transactionsDisassociated: 0,
            paymentsPurged: 0,
            staffUsersDisassociated: 0,
            logsCleaned: 0,
        };
        const txns = await this.transactionModel.find({ ...filter, customer_id: { $ne: null } }).select('_id customer_id');
        if (txns.length > 0) {
            const custIds = [...new Set(txns.map((t) => t.customer_id?.toString()).filter((id) => Boolean(id)))];
            const validCusts = await this.customerModel.find({ _id: { $in: custIds } }).select('_id').lean();
            const validSet = new Set(validCusts.map((c) => c._id.toString()));
            for (const txn of txns) {
                if (txn.customer_id && !validSet.has(txn.customer_id.toString())) {
                    await this.transactionModel.updateOne({ _id: txn._id }, {
                        $set: {
                            'metadata.cleaned_orphan_customer_id': txn.customer_id.toString(),
                        },
                        $unset: { customer_id: 1 },
                    });
                    summary.transactionsDisassociated++;
                }
            }
        }
        const payments = await this.paymentModel.find(filter).select('_id transaction_id');
        if (payments.length > 0) {
            const txnIds = [...new Set(payments.map((p) => p.transaction_id?.toString()).filter((id) => Boolean(id)))];
            const validTxns = await this.transactionModel.find({ _id: { $in: txnIds } }).select('_id').lean();
            const validTxnSet = new Set(validTxns.map((t) => t._id.toString()));
            const deadPaymentIds = payments
                .filter((p) => !p.transaction_id || !validTxnSet.has(p.transaction_id.toString()))
                .map((p) => p._id);
            if (deadPaymentIds.length > 0) {
                await this.paymentModel.deleteMany({ _id: { $in: deadPaymentIds } });
                summary.paymentsPurged += deadPaymentIds.length;
            }
        }
        const staff = await this.staffModel.find({ ...filter, user_id: { $ne: null } }).select('_id user_id');
        if (staff.length > 0) {
            const userIds = [...new Set(staff.map((s) => s.user_id?.toString()).filter((id) => Boolean(id)))];
            const validUsers = await this.userModel.find({ _id: { $in: userIds } }).select('_id').lean();
            const validUserSet = new Set(validUsers.map((u) => u._id.toString()));
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
};
exports.DataIntegrityService = DataIntegrityService;
exports.DataIntegrityService = DataIntegrityService = DataIntegrityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(index_js_1.Tenant.name)),
    __param(1, (0, mongoose_1.InjectModel)(index_js_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(index_js_1.Branch.name)),
    __param(3, (0, mongoose_1.InjectModel)(index_js_1.Customer.name)),
    __param(4, (0, mongoose_1.InjectModel)(index_js_1.Product.name)),
    __param(5, (0, mongoose_1.InjectModel)(index_js_1.Transaction.name)),
    __param(6, (0, mongoose_1.InjectModel)(index_js_1.Payment.name)),
    __param(7, (0, mongoose_1.InjectModel)(index_js_1.Staff.name)),
    __param(8, (0, mongoose_1.InjectModel)(index_js_1.InventoryLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DataIntegrityService);
//# sourceMappingURL=data-integrity.service.js.map