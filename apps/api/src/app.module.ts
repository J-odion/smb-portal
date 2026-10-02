import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenantInterceptor } from './common/interceptors/tenant.interceptor.js';
import { getTenantId } from './common/tenant-context.js';
import { AuthModule } from './auth/auth.module.js';
import { TenantModule } from './tenant/tenant.module.js';
import { CustomersModule } from './customers/customers.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { ExpensesModule } from './expenses/expenses.module.js';
import { StaffModule } from './staff/staff.module.js';
import { DatabaseModule } from './database/database.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsModule } from './payments/payments.module.js';
import { BranchesModule } from './branches/branches.module.js';
import { InventoryModule } from './inventory/inventory.module.js';
import { SyncModule } from './sync/sync.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { SuperAdminModule } from './super-admin/super-admin.module.js';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// In a real app we'd use redisStore from 'cache-manager-redis-yet'
// and load config from ConfigModule
@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100, // Security: max 100 requests per minute per IP
    }]),
    MongooseModule.forRoot(process.env.DATABASE_URL || 'mongodb://localhost:27017/smb-portal', {
      connectionFactory: (connection) => {
        connection.plugin((schema: any) => {
          // Do not apply to Tenant and User models as they might need cross-tenant logic for auth
          if (schema.options.collection === 'tenants' || schema.options.collection === 'users') return;
          
          ['find', 'findOne', 'countDocuments', 'update', 'updateOne', 'updateMany', 'findOneAndUpdate'].forEach((method) => {
            schema.pre(method, function (this: any, next: Function) {
              const tenantId = getTenantId();
              if (tenantId) {
                this.where({ tenant_id: tenantId });
              }
              next();
            });
          });

          // Pre-save hook to ensure tenant_id is set on creation
          schema.pre('save', function (this: any, next: Function) {
            const tenantId = getTenantId();
            if (tenantId && !this.tenant_id) {
              this.tenant_id = tenantId;
            }
            next();
          });
        });
        return connection;
      },
    }),
    DatabaseModule,
    CacheModule.register({
      isGlobal: true,
      // store: redisStore,
      // url: 'redis://localhost:6379',
    }),
    AuthModule,
    TenantModule,
    CustomersModule,
    TransactionsModule,
    ExpensesModule,
    StaffModule,
    PaymentsModule,
    BranchesModule,
    InventoryModule,
    SyncModule,
    AnalyticsModule,
    SuperAdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
