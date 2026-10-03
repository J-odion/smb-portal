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
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const index_js_1 = require("../../schemas/index.js");
let AuditInterceptor = class AuditInterceptor {
    auditLogModel;
    constructor(auditLogModel) {
        this.auditLogModel = auditLogModel;
    }
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const { method, url, user, body } = req;
        return next.handle().pipe((0, operators_1.tap)(async () => {
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
                if (user && user.tenantId) {
                    try {
                        await this.auditLogModel.create({
                            tenant_id: user.tenantId,
                            user_id: user.userId,
                            action: method,
                            resource: url,
                            resource_id: 'N/A',
                            details: body || {},
                        });
                    }
                    catch (err) {
                        console.error('Failed to create audit log', err);
                    }
                }
            }
        }));
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(index_js_1.AuditLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map