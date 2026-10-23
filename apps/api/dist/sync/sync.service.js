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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const index_js_1 = require("../schemas/index.js");
let SyncService = class SyncService {
    customerModel;
    transactionModel;
    constructor(customerModel, transactionModel) {
        this.customerModel = customerModel;
        this.transactionModel = transactionModel;
    }
    async syncOfflineData(tenantId, payload) {
        const results = {
            customersSynced: 0,
            transactionsSynced: 0,
            errors: [],
        };
        const customerMap = new Map();
        if (payload.customers && Array.isArray(payload.customers) && payload.customers.length > 0) {
            try {
                const customerOps = payload.customers.map((c) => {
                    const offlineId = c.id || c.offline_id;
                    return {
                        updateOne: {
                            filter: { tenant_id: tenantId, phone: c.phone },
                            update: {
                                $set: {
                                    name: c.name,
                                    phone: c.phone,
                                    whatsapp: c.whatsapp,
                                    address: c.address,
                                    tenant_id: tenantId,
                                    ...(offlineId ? { 'metadata.offline_id': offlineId } : {}),
                                },
                            },
                            upsert: true,
                        },
                    };
                });
                const result = await this.customerModel.bulkWrite(customerOps, { ordered: false });
                results.customersSynced = result.upsertedCount + result.modifiedCount;
                const phones = payload.customers.map((c) => c.phone).filter(Boolean);
                const offlineIds = payload.customers.map((c) => c.id || c.offline_id).filter(Boolean);
                const dbCustomers = await this.customerModel
                    .find({
                    tenant_id: tenantId,
                    $or: [
                        { phone: { $in: phones } },
                        { 'metadata.offline_id': { $in: offlineIds } },
                    ],
                })
                    .select('_id phone metadata')
                    .exec();
                for (const cust of dbCustomers) {
                    if (cust.phone)
                        customerMap.set(cust.phone, cust._id);
                    if (cust.metadata?.offline_id)
                        customerMap.set(cust.metadata.offline_id, cust._id);
                }
            }
            catch (err) {
                results.errors.push({ type: 'customers_bulk', error: err.message });
            }
        }
        if (payload.transactions && Array.isArray(payload.transactions) && payload.transactions.length > 0) {
            try {
                const candidateCustomerIds = payload.transactions
                    .map((txn) => txn.customer_id)
                    .filter((id) => id && typeof id === 'string' && mongoose_2.Types.ObjectId.isValid(id) && !customerMap.has(id));
                if (candidateCustomerIds.length > 0) {
                    const verifiedCustomers = await this.customerModel
                        .find({ tenant_id: tenantId, _id: { $in: candidateCustomerIds } })
                        .select('_id')
                        .exec();
                    for (const vc of verifiedCustomers) {
                        customerMap.set(vc._id.toString(), vc._id);
                    }
                }
                const transactionOps = payload.transactions.map((txn) => {
                    const offlineId = txn.id || txn.offline_id;
                    let resolvedCustomerId = null;
                    let unresolvedCustomerId = null;
                    if (txn.customer_id) {
                        const rawId = String(txn.customer_id);
                        if (customerMap.has(rawId)) {
                            resolvedCustomerId = customerMap.get(rawId);
                        }
                        else if (txn.customer_phone && customerMap.has(txn.customer_phone)) {
                            resolvedCustomerId = customerMap.get(txn.customer_phone);
                        }
                        else {
                            unresolvedCustomerId = rawId;
                        }
                    }
                    return {
                        updateOne: {
                            filter: { tenant_id: tenantId, 'metadata.offline_id': offlineId },
                            update: {
                                $setOnInsert: {
                                    tenant_id: tenantId,
                                    customer_id: resolvedCustomerId,
                                    type: txn.type || 'SALE',
                                    subtotal: txn.subtotal,
                                    vat: txn.vat || 0,
                                    total: txn.total,
                                    status: txn.status || 'Pending',
                                    metadata: {
                                        offline_id: offlineId,
                                        ...(unresolvedCustomerId ? { unresolved_customer_id: unresolvedCustomerId } : {}),
                                        ...txn.metadata,
                                    },
                                    items: (txn.items && Array.isArray(txn.items)) ? txn.items.map((item) => ({
                                        description: item.description,
                                        quantity: item.quantity,
                                        unit_price: item.unit_price,
                                        product_id: item.product_id && mongoose_2.Types.ObjectId.isValid(item.product_id) ? item.product_id : undefined,
                                    })) : []
                                }
                            },
                            upsert: true
                        }
                    };
                });
                const result = await this.transactionModel.bulkWrite(transactionOps, { ordered: false });
                results.transactionsSynced = result.upsertedCount;
            }
            catch (err) {
                results.errors.push({ type: 'transactions_bulk', error: err.message });
            }
        }
        return results;
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(index_js_1.Customer.name)),
    __param(1, (0, mongoose_1.InjectModel)(index_js_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SyncService);
//# sourceMappingURL=sync.service.js.map