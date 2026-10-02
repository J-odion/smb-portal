import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Tenant, TenantSchema,
  User, UserSchema,
  Branch, BranchSchema,
  Customer, CustomerSchema,
  Product, ProductSchema,
  Transaction, TransactionSchema,
  TransactionItem, TransactionItemSchema,
  Payment, PaymentSchema,
  Expense, ExpenseSchema,
  Staff, StaffSchema,
  AuditLog, AuditLogSchema,
  Appointment, AppointmentSchema,
  Measurement, MeasurementSchema,
  NotificationLog, NotificationLogSchema,
} from '../schemas/index.js';

const mongooseModels = MongooseModule.forFeature([
  { name: Tenant.name, schema: TenantSchema },
  { name: User.name, schema: UserSchema },
  { name: Branch.name, schema: BranchSchema },
  { name: Customer.name, schema: CustomerSchema },
  { name: Product.name, schema: ProductSchema },
  { name: Transaction.name, schema: TransactionSchema },
  { name: TransactionItem.name, schema: TransactionItemSchema },
  { name: Payment.name, schema: PaymentSchema },
  { name: Expense.name, schema: ExpenseSchema },
  { name: Staff.name, schema: StaffSchema },
  { name: AuditLog.name, schema: AuditLogSchema },
  { name: Appointment.name, schema: AppointmentSchema },
  { name: Measurement.name, schema: MeasurementSchema },
  { name: NotificationLog.name, schema: NotificationLogSchema },
]);

@Global()
@Module({
  imports: [mongooseModels],
  exports: [mongooseModels],
})
export class DatabaseModule {}
