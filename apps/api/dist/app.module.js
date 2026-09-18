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
const auth_module_js_1 = require("./auth/auth.module.js");
const tenant_module_js_1 = require("./tenant/tenant.module.js");
const customers_module_js_1 = require("./customers/customers.module.js");
const transactions_module_js_1 = require("./transactions/transactions.module.js");
const expenses_module_js_1 = require("./expenses/expenses.module.js");
const staff_module_js_1 = require("./staff/staff.module.js");
const prisma_module_js_1 = require("./prisma/prisma.module.js");
const payments_module_js_1 = require("./payments/payments.module.js");
const branches_module_js_1 = require("./branches/branches.module.js");
const inventory_module_js_1 = require("./inventory/inventory.module.js");
const sync_module_js_1 = require("./sync/sync.module.js");
const analytics_module_js_1 = require("./analytics/analytics.module.js");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_js_1.PrismaModule,
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
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map