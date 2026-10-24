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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const index_js_1 = require("../schemas/index.js");
let InventoryService = class InventoryService {
    productModel;
    inventoryLogModel;
    constructor(productModel, inventoryLogModel) {
        this.productModel = productModel;
        this.inventoryLogModel = inventoryLogModel;
    }
    async findAll(tenantId) {
        return this.productModel
            .find({ tenant_id: tenantId })
            .sort({ created_at: -1 })
            .exec();
    }
    async findOne(tenantId, id) {
        const product = await this.productModel.findOne({ _id: id, tenant_id: tenantId }).exec();
        if (!product) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        return product;
    }
    async create(tenantId, data) {
        const sku = data.sku?.trim() || `SKU-${Date.now().toString().slice(-6)}`;
        const price = Number(data.price) || 0;
        const stock_level = Number(data.stock_level) || 0;
        const product = await this.productModel.create({
            tenant_id: new mongoose_2.Types.ObjectId(tenantId),
            name: data.name,
            sku,
            category: data.category || 'General',
            price,
            stock_level,
        });
        if (stock_level > 0) {
            try {
                await this.inventoryLogModel.create({
                    tenant_id: new mongoose_2.Types.ObjectId(tenantId),
                    product_id: product._id,
                    quantity_change: stock_level,
                    reason: 'Initial stock intake',
                });
            }
            catch (logErr) {
                console.warn('Could not record initial inventory log:', logErr);
            }
        }
        return product;
    }
    async update(tenantId, id, data) {
        const updateData = { ...data };
        if (updateData.price !== undefined)
            updateData.price = Number(updateData.price);
        if (updateData.stock_level !== undefined)
            updateData.stock_level = Number(updateData.stock_level);
        const updated = await this.productModel.findOneAndUpdate({ _id: id, tenant_id: tenantId }, { $set: updateData }, { new: true }).exec();
        if (!updated) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        return updated;
    }
    async delete(tenantId, id) {
        const deleted = await this.productModel.findOneAndDelete({
            _id: id,
            tenant_id: tenantId,
        }).exec();
        if (!deleted) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        return { success: true, message: 'Item deleted successfully' };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(index_js_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(index_js_1.InventoryLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map