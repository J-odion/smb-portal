import { PrismaService } from '../prisma/prisma.service';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<any>;
    create(tenantId: string, data: {
        name: string;
        phone: string;
        whatsapp?: string;
        address?: string;
        notes?: string;
        whatsapp_consent?: boolean;
    }): Promise<any>;
}
