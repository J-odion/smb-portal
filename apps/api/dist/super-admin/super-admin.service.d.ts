import { Model } from 'mongoose';
import { Tenant, User } from '../schemas/index.js';
import { DataIntegrityService } from '../database/data-integrity.service.js';
export declare class SuperAdminService {
    private tenantModel;
    private userModel;
    private readonly dataIntegrityService;
    constructor(tenantModel: Model<Tenant>, userModel: Model<User>, dataIntegrityService: DataIntegrityService);
    getGlobalMetrics(): Promise<{
        totalTenants: number;
        activeUsers: number;
        serverLoad: number;
        openTickets: number;
    }>;
    getAllTenants(): Promise<(import("mongoose").Document<unknown, {}, Tenant, {}, import("mongoose").DefaultSchemaOptions> & Tenant & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    suspendTenant(tenantId: string): Promise<{
        message: string;
        tenant: import("mongoose").Document<unknown, {}, Tenant, {}, import("mongoose").DefaultSchemaOptions> & Tenant & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    broadcastMessage(subject: string, message: string): Promise<{
        success: boolean;
        recipientsCount: number;
        message: string;
    }>;
    overrideSubscription(tenantId: string, timeline: '1Y' | '2Y' | 'LIFETIME'): Promise<{
        message: string;
        tenant: import("mongoose").Document<unknown, {}, Tenant, {}, import("mongoose").DefaultSchemaOptions> & Tenant & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    auditIntegrity(tenantId?: string): Promise<import("../database/data-integrity.service.js").IntegrityAuditReport>;
    cleanupIntegrity(tenantId?: string): Promise<{
        cleanedCount: number;
        summary: Record<string, number>;
    }>;
}
