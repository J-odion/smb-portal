import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../schemas").Transaction, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas").Transaction & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(req: any, body: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas").Transaction, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas").Transaction & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
