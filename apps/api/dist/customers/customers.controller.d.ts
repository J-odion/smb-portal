import { CustomersService } from './customers.service';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    findAll(req: any): Promise<{
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
    }[]>;
    create(req: any, body: any): Promise<{
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
    }>;
}
