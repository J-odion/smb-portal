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
exports.SuperAdminController = void 0;
const common_1 = require("@nestjs/common");
const super_admin_service_js_1 = require("./super-admin.service.js");
const jwt_auth_guard_js_1 = require("../auth/jwt-auth.guard.js");
const roles_guard_js_1 = require("../auth/roles.guard.js");
const roles_decorator_js_1 = require("../auth/roles.decorator.js");
let SuperAdminController = class SuperAdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    getMetrics() {
        return this.adminService.getGlobalMetrics();
    }
    getTenants() {
        return this.adminService.getAllTenants();
    }
    suspendTenant(tenantId) {
        return this.adminService.suspendTenant(tenantId);
    }
    broadcast(body) {
        return this.adminService.broadcastMessage(body.subject, body.message);
    }
    overrideSubscription(tenantId, timeline) {
        return this.adminService.overrideSubscription(tenantId, timeline);
    }
};
exports.SuperAdminController = SuperAdminController;
__decorate([
    (0, common_1.Get)('metrics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuperAdminController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('tenants'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuperAdminController.prototype, "getTenants", null);
__decorate([
    (0, common_1.Post)('tenants/:id/suspend'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuperAdminController.prototype, "suspendTenant", null);
__decorate([
    (0, common_1.Post)('broadcast'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SuperAdminController.prototype, "broadcast", null);
__decorate([
    (0, common_1.Post)('tenants/:id/subscription-override'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('timeline')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SuperAdminController.prototype, "overrideSubscription", null);
exports.SuperAdminController = SuperAdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('SUPER_ADMIN'),
    __metadata("design:paramtypes", [super_admin_service_js_1.SuperAdminService])
], SuperAdminController);
//# sourceMappingURL=super-admin.controller.js.map