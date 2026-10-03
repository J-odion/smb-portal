import { Model } from 'mongoose';
import { Tenant, User } from '../schemas/index.js';
export declare class TenantService {
    private tenantModel;
    private userModel;
    constructor(tenantModel: Model<Tenant>, userModel: Model<User>);
    getProfile(tenantId: string): Promise<{
        users: (import("mongoose").Document<unknown, {}, User, {}, import("mongoose").DefaultSchemaOptions> & User & Required<{
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
    updateIndustry(tenantId: string, industry: string): Promise<(import("mongoose").Document<unknown, {}, Tenant, {}, import("mongoose").DefaultSchemaOptions> & Tenant & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    updateSubscription(tenantId: string, tier: string): Promise<(import("mongoose").Document<unknown, {}, Tenant, {}, import("mongoose").DefaultSchemaOptions> & Tenant & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    inviteUser(tenantId: string, email: string, role: string): Promise<import("mongoose").Document<unknown, {}, User, {}, import("mongoose").DefaultSchemaOptions> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    removeUser(tenantId: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, User, {}, import("mongoose").DefaultSchemaOptions> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
