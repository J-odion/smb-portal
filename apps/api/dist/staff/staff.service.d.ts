import { PrismaService } from '../prisma/prisma.service';
export declare class StaffService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<any>;
    create(tenantId: string, data: {
        name: string;
        phone: string;
        pay_type: string;
        flat_amount?: number;
        commission_percent?: number;
    }): Promise<any>;
}
