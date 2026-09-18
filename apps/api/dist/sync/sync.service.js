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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SyncService = class SyncService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async syncOfflineData(tenantId, payload) {
        const results = {
            customersSynced: 0,
            transactionsSynced: 0,
            errors: [],
        };
        if (payload.customers && Array.isArray(payload.customers)) {
            for (const customer of payload.customers) {
                try {
                    await this.prisma.customer.upsert({
                        where: { id: customer.id || 'new-uuid-placeholder' },
                        update: {
                            name: customer.name,
                            phone: customer.phone,
                            whatsapp: customer.whatsapp,
                            address: customer.address,
                        },
                        create: {
                            tenant_id: tenantId,
                            name: customer.name,
                            phone: customer.phone,
                            whatsapp: customer.whatsapp,
                            address: customer.address,
                        },
                    });
                    results.customersSynced++;
                }
                catch (err) {
                    results.errors.push({ type: 'customer', id: customer.id, error: err.message });
                }
            }
        }
        if (payload.transactions && Array.isArray(payload.transactions)) {
            for (const txn of payload.transactions) {
                try {
                    await this.prisma.transaction.create({
                        data: {
                            tenant_id: tenantId,
                            customer_id: txn.customer_id,
                            subtotal: txn.subtotal,
                            vat: txn.vat || 0,
                            total: txn.total,
                            status: txn.status || 'Pending',
                            items: {
                                create: txn.items?.map((item) => ({
                                    description: item.description,
                                    quantity: item.quantity,
                                    unit_price: item.unit_price,
                                })) || [],
                            },
                        },
                    });
                    results.transactionsSynced++;
                }
                catch (err) {
                    results.errors.push({ type: 'transaction', id: txn.id, error: err.message });
                }
            }
        }
        return results;
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SyncService);
//# sourceMappingURL=sync.service.js.map