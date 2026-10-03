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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const index_js_1 = require("../schemas/index.js");
let TransactionsService = class TransactionsService {
    transactionModel;
    transactionItemModel;
    constructor(transactionModel, transactionItemModel) {
        this.transactionModel = transactionModel;
        this.transactionItemModel = transactionItemModel;
    }
    async findAll(tenantId) {
        return this.transactionModel.find({ tenant_id: tenantId }).populate('customer_id').sort({ created_at: -1 }).exec();
    }
    async create(tenantId, data) {
        const transaction = await this.transactionModel.create({
            tenant_id: tenantId,
            customer_id: data.customer_id,
            subtotal: data.subtotal,
            vat: data.vat,
            total: data.total,
        });
        if (data.items && data.items.length > 0) {
            const itemsToInsert = data.items.map(item => ({
                transaction_id: transaction._id,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
            }));
            await this.transactionItemModel.insertMany(itemsToInsert);
        }
        return transaction;
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(index_js_1.Transaction.name)),
    __param(1, (0, mongoose_1.InjectModel)(index_js_1.TransactionItem.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map