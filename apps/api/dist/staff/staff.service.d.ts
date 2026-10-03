import { Model } from 'mongoose';
import { Staff } from '../schemas/index.js';
export declare class StaffService {
    private staffModel;
    constructor(staffModel: Model<Staff>);
    findAll(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, Staff, {}, import("mongoose").DefaultSchemaOptions> & Staff & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(tenantId: string, data: {
        name: string;
        phone: string;
        pay_type: string;
        flat_amount?: number;
        commission_percent?: number;
    }): Promise<import("mongoose").Document<unknown, {}, Staff, {}, import("mongoose").DefaultSchemaOptions> & Staff & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
