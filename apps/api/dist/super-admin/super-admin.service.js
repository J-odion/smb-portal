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
exports.SuperAdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const index_js_1 = require("../schemas/index.js");
let SuperAdminService = class SuperAdminService {
    tenantModel;
    userModel;
    constructor(tenantModel, userModel) {
        this.tenantModel = tenantModel;
        this.userModel = userModel;
    }
    async getGlobalMetrics() {
        const totalTenants = await this.tenantModel.countDocuments();
        const activeUsers = await this.userModel.countDocuments();
        const serverLoad = Math.floor(Math.random() * 40) + 20;
        return {
            totalTenants,
            activeUsers,
            serverLoad,
            openTickets: 24,
        };
    }
    async getAllTenants() {
        return this.tenantModel.find().sort({ created_at: -1 }).exec();
    }
    async suspendTenant(tenantId) {
        const tenant = await this.tenantModel.findById(tenantId);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        tenant.subscription_status = 'SUSPENDED';
        await tenant.save();
        return { message: 'Tenant suspended successfully', tenant };
    }
    async broadcastMessage(subject, message) {
        const owners = await this.userModel.find({ role: 'OWNER' }).select('email').exec();
        console.log(`[SYSTEM BROADCAST] Sending "${subject}" to ${owners.length} tenant owners.`);
        return {
            success: true,
            recipientsCount: owners.length,
            message: 'Broadcast dispatched to queue'
        };
    }
    async overrideSubscription(tenantId, timeline) {
        const tenant = await this.tenantModel.findById(tenantId);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const now = new Date();
        let endsAt = new Date();
        if (timeline === '1Y') {
            endsAt.setFullYear(now.getFullYear() + 1);
        }
        else if (timeline === '2Y') {
            endsAt.setFullYear(now.getFullYear() + 2);
        }
        else if (timeline === 'LIFETIME') {
            endsAt.setFullYear(now.getFullYear() + 100);
        }
        tenant.subscription_status = 'ACTIVE';
        tenant.subscription_tier = 'PRO';
        tenant.subscription_ends_at = endsAt;
        await tenant.save();
        return { message: `Subscription overridden for ${timeline}`, tenant };
    }
};
exports.SuperAdminService = SuperAdminService;
exports.SuperAdminService = SuperAdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(index_js_1.Tenant.name)),
    __param(1, (0, mongoose_1.InjectModel)(index_js_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SuperAdminService);
//# sourceMappingURL=super-admin.service.js.map