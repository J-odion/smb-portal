import { InventoryService } from './inventory.service.js';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/index.js").Product, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/index.js").Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(req: any, id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/index.js").Product, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/index.js").Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    create(req: any, body: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/index.js").Product, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/index.js").Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(req: any, id: string, body: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/index.js").Product, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/index.js").Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    delete(req: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
