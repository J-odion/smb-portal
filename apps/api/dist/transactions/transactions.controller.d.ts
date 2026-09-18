import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    findAll(req: any): Promise<any>;
    create(req: any, body: any): Promise<any>;
}
