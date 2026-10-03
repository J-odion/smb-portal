import { StaffService } from './staff.service';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../schemas").Staff, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas").Staff & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(req: any, body: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas").Staff, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas").Staff & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
