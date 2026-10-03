import { SuperAdminService } from './super-admin.service.js';
export declare class SuperAdminController {
    private readonly adminService;
    constructor(adminService: SuperAdminService);
    getMetrics(): Promise<{
        totalTenants: number;
        activeUsers: number;
        serverLoad: number;
        openTickets: number;
    }>;
    getTenants(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/index.js").Tenant, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/index.js").Tenant & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    suspendTenant(tenantId: string): Promise<{
        message: string;
        tenant: import("mongoose").Document<unknown, {}, import("../schemas/index.js").Tenant, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/index.js").Tenant & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    broadcast(body: {
        subject: string;
        message: string;
    }): Promise<{
        success: boolean;
        recipientsCount: number;
        message: string;
    }>;
    overrideSubscription(tenantId: string, timeline: '1Y' | '2Y' | 'LIFETIME'): Promise<{
        message: string;
        tenant: import("mongoose").Document<unknown, {}, import("../schemas/index.js").Tenant, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/index.js").Tenant & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
