import { PrismaService } from '../prisma/prisma.service';
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<any>;
    create(tenantId: string, data: {
        customer_id: string;
        subtotal: number;
        vat: number;
        total: number;
        items: any[];
    }): Promise<any>;
}
