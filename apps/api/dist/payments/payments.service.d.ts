import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<any>;
    create(tenantId: string, data: {
        transaction_id: string;
        amount: number;
        method: string;
        staff_id?: string;
    }): Promise<any>;
}
