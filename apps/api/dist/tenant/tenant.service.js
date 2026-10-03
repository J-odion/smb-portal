"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
        const crypto = await Promise.resolve().then(() => __importStar(require('crypto')));
        const bcrypt = await Promise.resolve().then(() => __importStar(require('bcrypt')));
        const tempPassword = crypto.randomBytes(16).toString('hex');
        const password_hash = await bcrypt.hash(tempPassword, 10);
        return this.userModel.create({
            email,
            password_hash,
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