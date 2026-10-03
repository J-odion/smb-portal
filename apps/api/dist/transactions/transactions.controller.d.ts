import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/transaction.dto.js';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    findAll(req: any, page?: string, limit?: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../schemas").Transaction, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas").Transaction & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(req: any, body: CreateTransactionDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas").Transaction, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas").Transaction & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
