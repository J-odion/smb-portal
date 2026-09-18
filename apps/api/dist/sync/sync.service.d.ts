import { PrismaService } from '../prisma/prisma.service';
export declare class SyncService {
    private prisma;
    constructor(prisma: PrismaService);
    syncOfflineData(tenantId: string, payload: any): Promise<{
        customersSynced: number;
        transactionsSynced: number;
        errors: any[];
    }>;
}
