"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantContext = void 0;
exports.getTenantId = getTenantId;
const async_hooks_1 = require("async_hooks");
exports.tenantContext = new async_hooks_1.AsyncLocalStorage();
function getTenantId() {
    const store = exports.tenantContext.getStore();
    return store?.tenantId;
}
//# sourceMappingURL=tenant-context.js.map