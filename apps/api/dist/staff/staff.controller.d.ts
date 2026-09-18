import { StaffService } from './staff.service';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    findAll(req: any): Promise<any>;
    create(req: any, body: any): Promise<any>;
}
