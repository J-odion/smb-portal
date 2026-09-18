import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    findAll(req: any): Promise<({
        customer: {
            id: string;
            tenant_id: string;
            created_at: Date;
            name: string;
            address: string | null;
            phone: string;
            whatsapp: string | null;
            notes: string | null;
            whatsapp_consent: boolean;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        } | null;
    } & {
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
    })[]>;
    create(req: any, body: any): Promise<{
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
    }>;
}
