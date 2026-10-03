import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../schemas").Payment, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas").Payment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(req: any, body: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas").Payment, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas").Payment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    createCheckoutSession(req: any): Promise<{
        url: string | null;
    }>;
}
