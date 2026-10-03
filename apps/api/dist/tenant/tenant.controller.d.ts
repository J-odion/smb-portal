import { TenantService } from './tenant.service.js';
export declare class TenantController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
    getProfile(req: any): Promise<{
        users: (import("mongoose").Document<unknown, {}, import("../schemas/index.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/index.js").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        name: string;
        industry: string;
        logo_url?: string;
        address?: string;
        bank_name?: string;
        account_no?: string;
        account_name?: string;
        subscription_tier: string;
        subscription_status: string;
        trial_ends_at?: Date;
        subscription_ends_at?: Date;
        stripe_customer_id?: string;
        stripe_subscription_id?: string;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    updateIndustry(req: any, industry: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/index.js").Tenant, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/index.js").Tenant & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    updateSubscription(req: any, tier: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/index.js").Tenant, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/index.js").Tenant & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    inviteUser(req: any, email: string, role: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/index.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/index.js").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    removeUser(req: any, userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/index.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/index.js").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
