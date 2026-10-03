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
    customerModel;
    productModel;
    constructor(transactionModel, customerModel, productModel) {
        this.transactionModel = transactionModel;
        this.customerModel = customerModel;
        this.productModel = productModel;
    }
    async findAll(tenantId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.transactionModel
                .find({ tenant_id: tenantId })
                .populate('customer_id')
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.transactionModel.countDocuments({ tenant_id: tenantId }).exec()
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async create(tenantId, data) {
        if (data.customer_id) {
            const validCustomer = await this.customerModel.findOne({ _id: data.customer_id }).exec();
            if (!validCustomer) {
                throw new common_1.BadRequestException('Invalid customer ID');
            }
        }
        let calculatedSubtotal = 0;
        const finalItems = [];
        if (data.items && data.items.length > 0) {
            for (const item of data.items) {
                let unit_price = item.unit_price;
                if (item.product_id) {
                    const product = await this.productModel.findOne({ _id: item.product_id }).exec();
                    if (!product) {
                        throw new common_1.BadRequestException(`Invalid product ID: ${item.product_id}`);
                    }
                    unit_price = product.price;
                }
                calculatedSubtotal += (item.quantity * unit_price);
                finalItems.push({
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: unit_price,
                    product_id: item.product_id,
                });
            }
        }
        else {
            calculatedSubtotal = data.subtotal;
        }
        const calculatedVat = data.vat;
        const calculatedTotal = calculatedSubtotal + calculatedVat;
        const transaction = await this.transactionModel.create({
            tenant_id: tenantId,
            customer_id: data.customer_id,
            subtotal: calculatedSubtotal,
            vat: calculatedVat,
            total: calculatedTotal,
            items: finalItems,
        });
        return transaction;
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(index_js_1.Transaction.name)),
    __param(1, (0, mongoose_1.InjectModel)(index_js_1.Customer.name)),
    __param(2, (0, mongoose_1.InjectModel)(index_js_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map