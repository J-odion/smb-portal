import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    findAll(req: any): Promise<({
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
    create(req: any, body: any): Promise<{
        id: string;
        tenant_id: string;
        created_at: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        transaction_id: string;
        method: string;
    }>;
}
