import { PrismaService } from '../prisma/prisma.service';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<{
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
    create(tenantId: string, data: {
        name: string;
        phone: string;
        whatsapp?: string;
        address?: string;
        notes?: string;
        whatsapp_consent?: boolean;
    }): Promise<{
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
