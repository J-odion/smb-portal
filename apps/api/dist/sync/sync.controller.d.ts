import { SyncService } from './sync.service';
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    handleSync(req: any, body: any): Promise<{
        customersSynced: number;
        transactionsSynced: number;
        errors: any[];
    }>;
}
