import { ExpensesService } from './expenses.service';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    findAll(req: any): Promise<{
        id: string;
        tenant_id: string;
        created_at: Date;
        branch_id: string | null;
        category: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        note: string | null;
    }[]>;
    create(req: any, body: any): Promise<{
        id: string;
        tenant_id: string;
        created_at: Date;
        branch_id: string | null;
        category: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        note: string | null;
    }>;
}
