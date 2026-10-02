import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tenantContext } from './tenant-context.js';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (user && user.tenantId) {
      return new Observable((subscriber) => {
        tenantContext.run({ tenantId: user.tenantId }, () => {
          next.handle().subscribe(subscriber);
        });
      });
    }

    return next.handle();
  }
}
