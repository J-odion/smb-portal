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
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const index_js_1 = require("../schemas/index.js");
let TenantService = class TenantService {
    tenantModel;
    userModel;
    constructor(tenantModel, userModel) {
        this.tenantModel = tenantModel;
        this.userModel = userModel;
    }
    async getProfile(tenantId) {
        const tenant = await this.tenantModel.findById(tenantId).exec();
        const users = await this.userModel.find({ tenant_id: tenantId }).select('id email role').exec();
        if (!tenant)
            throw new Error('Tenant not found');
        return { ...tenant.toObject(), users };
    }
    async updateIndustry(tenantId, industry) {
        return this.tenantModel.findByIdAndUpdate(tenantId, { industry }, { new: true }).exec();
    }
    async updateSubscription(tenantId, tier) {
        return this.tenantModel.findByIdAndUpdate(tenantId, { subscription_tier: tier }, { new: true }).exec();
    }
    async inviteUser(tenantId, email, role) {
        const existing = await this.userModel.findOne({ email }).exec();
        if (existing) {
            throw new Error('User already exists in the system.');
        }
        return this.userModel.create({
            email,
            password_hash: 'DEFAULT_PASSWORD_SHOULD_CHANGE',
            role,
            tenant_id: tenantId
        });
    }
    async removeUser(tenantId, userId) {
        const user = await this.userModel.findOne({ _id: userId, tenant_id: tenantId }).exec();
        if (!user)
            throw new Error('User not found in your tenant');
        if (user.role === 'OWNER')
            throw new Error('Cannot remove the tenant owner');
        return this.userModel.findByIdAndDelete(userId).exec();
    }
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(index_js_1.Tenant.name)),
    __param(1, (0, mongoose_1.InjectModel)(index_js_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], TenantService);
//# sourceMappingURL=tenant.service.js.map