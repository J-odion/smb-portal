import { StaffService } from './staff.service';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    findAll(req: any): Promise<{
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
    create(req: any, body: any): Promise<{
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
