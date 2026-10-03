import { ExpensesService } from './expenses.service';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../schemas").Expense, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas").Expense & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(req: any, body: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas").Expense, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas").Expense & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
