import { PrismaService } from '../prisma/prisma.service';
export declare class StaffService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<{
        id: string;
        tenant_id: string;
        created_at: Date;
        name: string;
        phone: string | null;
        branch_id: string | null;
        pay_type: string;
        flat_amount: import("@prisma/client/runtime/library").Decimal | null;
        commission_percent: import("@prisma/client/runtime/library").Decimal | null;
    }[]>;
    create(tenantId: string, data: {
        name: string;
        phone: string;
        pay_type: string;
        flat_amount?: number;
        commission_percent?: number;
    }): Promise<{
        id: string;
        tenant_id: string;
        created_at: Date;
        name: string;
        phone: string | null;
        branch_id: string | null;
        pay_type: string;
        flat_amount: import("@prisma/client/runtime/library").Decimal | null;
        commission_percent: import("@prisma/client/runtime/library").Decimal | null;
    }>;
}
