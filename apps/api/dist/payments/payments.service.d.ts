import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<({
        transaction: {
            id: string;
            tenant_id: string;
            created_at: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            branch_id: string | null;
            customer_id: string | null;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            vat: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
            status: string;
        };
    } & {
        id: string;
        tenant_id: string;
        created_at: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        transaction_id: string;
        method: string;
    })[]>;
    create(tenantId: string, data: {
        transaction_id: string;
        amount: number;
        method: string;
        staff_id?: string;
    }): Promise<{
        id: string;
        tenant_id: string;
        created_at: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        transaction_id: string;
        method: string;
    }>;
}
