import { Model } from 'mongoose';
import { Customer } from '../schemas/index.js';
export declare class CustomersService {
    private customerModel;
    constructor(customerModel: Model<Customer>);
    findAll(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, Customer, {}, import("mongoose").DefaultSchemaOptions> & Customer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(tenantId: string, data: {
        name: string;
        phone: string;
        whatsapp?: string;
        address?: string;
        notes?: string;
        whatsapp_consent?: boolean;
    }): Promise<import("mongoose").Document<unknown, {}, Customer, {}, import("mongoose").DefaultSchemaOptions> & Customer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
