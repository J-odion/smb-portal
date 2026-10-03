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
exports.TenantController = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_js_1 = require("./tenant.service.js");
const jwt_auth_guard_js_1 = require("../auth/jwt-auth.guard.js");
const roles_guard_js_1 = require("../auth/roles.guard.js");
const roles_decorator_js_1 = require("../auth/roles.decorator.js");
let TenantController = class TenantController {
    tenantService;
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    getProfile(req) {
        return this.tenantService.getProfile(req.user.tenantId);
    }
    updateIndustry(req, industry) {
        return this.tenantService.updateIndustry(req.user.tenantId, industry);
    }
    updateSubscription(req, tier) {
        return this.tenantService.updateSubscription(req.user.tenantId, tier);
    }
    inviteUser(req, email, role) {
        return this.tenantService.inviteUser(req.user.tenantId, email, role);
    }
    removeUser(req, userId) {
        return this.tenantService.removeUser(req.user.tenantId, userId);
    }
};
exports.TenantController = TenantController;
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "getProfile", null);
__decorate([
    (0, roles_decorator_js_1.Roles)('OWNER', 'MANAGER'),
    (0, common_1.Put)('industry'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('industry')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "updateIndustry", null);
__decorate([
    (0, roles_decorator_js_1.Roles)('OWNER'),
    (0, common_1.Put)('subscription'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('tier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "updateSubscription", null);
__decorate([
    (0, roles_decorator_js_1.Roles)('OWNER', 'MANAGER'),
    (0, common_1.Post)('users'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('email')),
    __param(2, (0, common_1.Body)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "inviteUser", null);
__decorate([
    (0, roles_decorator_js_1.Roles)('OWNER', 'MANAGER'),
    (0, common_1.Delete)('users/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "removeUser", null);
exports.TenantController = TenantController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, common_1.Controller)('tenant'),
    __metadata("design:paramtypes", [tenant_service_js_1.TenantService])
], TenantController);
//# sourceMappingURL=tenant.controller.js.map