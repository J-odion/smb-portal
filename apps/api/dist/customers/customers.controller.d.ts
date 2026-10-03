import { CustomersService } from './customers.service';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../schemas").Customer, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas").Customer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(req: any, body: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas").Customer, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas").Customer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
