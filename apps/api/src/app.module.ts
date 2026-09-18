import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module.js';
import { TenantModule } from './tenant/tenant.module.js';
import { CustomersModule } from './customers/customers.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { ExpensesModule } from './expenses/expenses.module.js';
import { StaffModule } from './staff/staff.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { BranchesModule } from './branches/branches.module.js';
import { InventoryModule } from './inventory/inventory.module.js';
import { SyncModule } from './sync/sync.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';

// In a real app we'd use redisStore from 'cache-manager-redis-yet'
// and load config from ConfigModule
@Module({
  imports: [
    PrismaModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
