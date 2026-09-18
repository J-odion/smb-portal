import { PrismaService } from '../prisma/prisma.service';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<any>;
    create(tenantId: string, data: {
        category: string;
        amount: number;
        note?: string;
    }): Promise<any>;
}
