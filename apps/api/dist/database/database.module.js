"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const index_js_1 = require("../schemas/index.js");
const mongooseModels = mongoose_1.MongooseModule.forFeature([
    { name: index_js_1.Tenant.name, schema: index_js_1.TenantSchema },
    { name: index_js_1.User.name, schema: index_js_1.UserSchema },
    { name: index_js_1.Branch.name, schema: index_js_1.BranchSchema },
    { name: index_js_1.Customer.name, schema: index_js_1.CustomerSchema },
    { name: index_js_1.Product.name, schema: index_js_1.ProductSchema },
    { name: index_js_1.InventoryLog.name, schema: index_js_1.InventoryLogSchema },
    { name: index_js_1.Transaction.name, schema: index_js_1.TransactionSchema },
    { name: index_js_1.Payment.name, schema: index_js_1.PaymentSchema },
    { name: index_js_1.Expense.name, schema: index_js_1.ExpenseSchema },
    { name: index_js_1.Staff.name, schema: index_js_1.StaffSchema },
    { name: index_js_1.AuditLog.name, schema: index_js_1.AuditLogSchema },
    { name: index_js_1.Appointment.name, schema: index_js_1.AppointmentSchema },
    { name: index_js_1.Measurement.name, schema: index_js_1.MeasurementSchema },
    { name: index_js_1.NotificationLog.name, schema: index_js_1.NotificationLogSchema },
]);
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [mongooseModels],
        exports: [mongooseModels],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map