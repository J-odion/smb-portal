import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from '../../schemas/index.js';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(@InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, user, body } = req;

    return next.handle().pipe(
      tap(async () => {
        // We only care about mutations for the audit log
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          if (user && user.tenantId) {
            try {
              await this.auditLogModel.create({
                tenant_id: user.tenantId,
                user_id: user.userId,
                action: method,
                resource: url,
                resource_id: 'N/A', // In a real scenario, extract from response or params
                details: body || {},
              });
            } catch (err) {
              console.error('Failed to create audit log', err);
            }
          }
        }
      }),
    );
  }
}

