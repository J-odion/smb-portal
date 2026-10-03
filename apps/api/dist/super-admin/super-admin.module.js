"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminModule = void 0;
const common_1 = require("@nestjs/common");
const super_admin_controller_js_1 = require("./super-admin.controller.js");
const super_admin_service_js_1 = require("./super-admin.service.js");
const mongoose_1 = require("@nestjs/mongoose");
const index_js_1 = require("../schemas/index.js");
const index_js_2 = require("../schemas/index.js");
let SuperAdminModule = class SuperAdminModule {
};
exports.SuperAdminModule = SuperAdminModule;
exports.SuperAdminModule = SuperAdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: index_js_1.Tenant.name, schema: index_js_2.TenantSchema },
                { name: index_js_1.User.name, schema: index_js_2.UserSchema }
            ])
        ],
        controllers: [super_admin_controller_js_1.SuperAdminController],
        providers: [super_admin_service_js_1.SuperAdminService]
    })
], SuperAdminModule);
//# sourceMappingURL=super-admin.module.js.map