import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Model } from 'mongoose';
import { AuditLog } from '../../schemas/index.js';
export declare class AuditInterceptor implements NestInterceptor {
    private auditLogModel;
    constructor(auditLogModel: Model<AuditLog>);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
