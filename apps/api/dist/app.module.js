"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const core_1 = require("@nestjs/core");
const tenant_interceptor_js_1 = require("./common/interceptors/tenant.interceptor.js");
const tenant_context_js_1 = require("./common/tenant-context.js");
const auth_module_js_1 = require("./auth/auth.module.js");
const tenant_module_js_1 = require("./tenant/tenant.module.js");
const customers_module_js_1 = require("./customers/customers.module.js");
const transactions_module_js_1 = require("./transactions/transactions.module.js");
const expenses_module_js_1 = require("./expenses/expenses.module.js");
const staff_module_js_1 = require("./staff/staff.module.js");
const database_module_js_1 = require("./database/database.module.js");
const mongoose_1 = require("@nestjs/mongoose");
const payments_module_js_1 = require("./payments/payments.module.js");
const branches_module_js_1 = require("./branches/branches.module.js");
const inventory_module_js_1 = require("./inventory/inventory.module.js");
const sync_module_js_1 = require("./sync/sync.module.js");
const analytics_module_js_1 = require("./analytics/analytics.module.js");
const super_admin_module_js_1 = require("./super-admin/super-admin.module.js");
const throttler_1 = require("@nestjs/throttler");
const core_2 = require("@nestjs/core");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            mongoose_1.MongooseModule.forRoot(process.env.DATABASE_URL || 'mongodb://localhost:27017/smb-portal', {
                connectionFactory: (connection) => {
                    connection.plugin((schema) => {
                        if (schema.options.collection === 'tenants' || schema.options.collection === 'users')
                            return;
                        ['find', 'findOne', 'countDocuments', 'update', 'updateOne', 'updateMany', 'findOneAndUpdate'].forEach((method) => {
                            schema.pre(method, function (next) {
                                const tenantId = (0, tenant_context_js_1.getTenantId)();
                                if (tenantId) {
                                    this.where({ tenant_id: tenantId });
                                }
                                next();
                            });
                        });
                        schema.pre('save', function (next) {
                            const tenantId = (0, tenant_context_js_1.getTenantId)();
                            if (tenantId && !this.tenant_id) {
                                this.tenant_id = tenantId;
                            }
                            next();
                        });
                    });
                    return connection;
                },
            }),
            database_module_js_1.DatabaseModule,
            cache_manager_1.CacheModule.register({
                isGlobal: true,
            }),
            auth_module_js_1.AuthModule,
            tenant_module_js_1.TenantModule,
            customers_module_js_1.CustomersModule,
            transactions_module_js_1.TransactionsModule,
            expenses_module_js_1.ExpensesModule,
            staff_module_js_1.StaffModule,
            payments_module_js_1.PaymentsModule,
            branches_module_js_1.BranchesModule,
            inventory_module_js_1.InventoryModule,
            sync_module_js_1.SyncModule,
            analytics_module_js_1.AnalyticsModule,
            super_admin_module_js_1.SuperAdminModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: tenant_interceptor_js_1.TenantInterceptor,
            },
            {
                provide: core_2.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map