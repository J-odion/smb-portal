import { PrismaService } from '../prisma/prisma.service';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<{
        id: string;
        tenant_id: string;
        created_at: Date;
        branch_id: string | null;
        category: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        note: string | null;
    }[]>;
    create(tenantId: string, data: {
        category: string;
        amount: number;
        note?: string;
    }): Promise<{
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
