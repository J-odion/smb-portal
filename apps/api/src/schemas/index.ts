import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Tenant extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 'RETAIL' })
  industry: string;

  @Prop()
  logo_url?: string;

  @Prop()
  address?: string;

  @Prop()
  bank_name?: string;

  @Prop()
  account_no?: string;

  @Prop()
  account_name?: string;

  @Prop({ default: 'FREE' })
  subscription_tier: string;

  @Prop({ default: 'TRIAL' })
  subscription_status: string;

  @Prop()
  trial_ends_at?: Date;

  @Prop()
  subscription_ends_at?: Date;

  @Prop()
  stripe_customer_id?: string;

  @Prop()
  stripe_subscription_id?: string;
}
export const TenantSchema = SchemaFactory.createForClass(Tenant);

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop({ default: 'STAFF', enum: ['OWNER', 'MANAGER', 'STAFF', 'SUPER_ADMIN'] })
  role: string;

  @Prop({ default: false })
  is_verified: boolean;

  @Prop()
  verification_token?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Tenant', required: true })
  tenant_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Branch' })
  branch_id?: Types.ObjectId;
}
export const UserSchema = SchemaFactory.createForClass(User);

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Branch extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Tenant', required: true })
  tenant_id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  address?: string;
}
export const BranchSchema = SchemaFactory.createForClass(Branch);

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Customer extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Tenant', required: true })
  tenant_id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  whatsapp?: string;

  @Prop()
  address?: string;

  @Prop()
  notes?: string;

  @Prop({ default: false })
  whatsapp_consent: boolean;

  @Prop({ type: SchemaTypes.Mixed })
  metadata?: any;
}
export const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.index({ tenant_id: 1, phone: 1 }, { unique: true });

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Product extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Tenant', required: true })
  tenant_id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  category?: string;

  @Prop()
  sku?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  stock_level: number;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ tenant_id: 1, sku: 1 }, { unique: true, sparse: true });
ProductSchema.index({ tenant_id: 1, name: 1 }, { unique: true });

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class InventoryLog extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Tenant', required: true })
  tenant_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Product', required: true })
  product_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Branch' })
  branch_id?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Transaction' })
  transaction_id?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Staff' })
  staff_id?: Types.ObjectId;

  @Prop({ required: true })
  quantity_change: number;

  @Prop({ required: true })
  reason: string;
}
export const InventoryLogSchema = SchemaFactory.createForClass(InventoryLog);
InventoryLogSchema.index({ tenant_id: 1, product_id: 1, created_at: -1 });

@Schema()
export class TransactionItem {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Product' })
  product_id?: Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unit_price: number;

  @Prop({ default: 0 })
  tax_rate?: number;

  @Prop({ default: 0 })
  tax_amount?: number;
}
export const TransactionItemSchema = SchemaFactory.createForClass(TransactionItem);

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Transaction extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Tenant', required: true })
  tenant_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Branch' })
  branch_id?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Customer' })
  customer_id?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Staff' })
  staff_id?: Types.ObjectId;

  @Prop({ type: [TransactionItemSchema], default: [] })
  items: TransactionItem[];

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true })
  vat: number;

  @Prop({ required: true })
  total: number;

  @Prop({ default: 'SALE', enum: ['SALE', 'REFUND', 'EXCHANGE'] })
  type: string;

  @Prop({ default: 0 })
  discount_amount?: number;

  @Prop()
  due_date?: Date;

  @Prop()
  invoice_number?: string;

  @Prop({ default: 'Pending' })
  status: string;

  @Prop({ type: SchemaTypes.Mixed })
  metadata?: any;
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.index({ tenant_id: 1, created_at: -1 });
TransactionSchema.index({ tenant_id: 1, customer_id: 1 });

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Payment extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Tenant', required: true })
  tenant_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Transaction', required: true })
  transaction_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Staff' })
  staff_id?: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  method: string;
}
export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.index({ tenant_id: 1, transaction_id: 1 });

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Expense extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Tenant', required: true })
  tenant_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Branch' })
  branch_id?: Types.ObjectId;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: Date.now })
  date: Date;

  @Prop()
  note?: string;
}
export const ExpenseSchema = SchemaFactory.createForClass(Expense);
ExpenseSchema.index({ tenant_id: 1, date: -1 });

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Staff extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Tenant', required: true })
  tenant_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Branch' })
  branch_id?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user_id?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  phone?: string;

  @Prop({ required: true })
  pay_type: string;

  @Prop()
  flat_amount?: number;

  @Prop()
  commission_percent?: number;
}
export const StaffSchema = SchemaFactory.createForClass(Staff);

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class AuditLog extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Tenant', required: true })
  tenant_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  resource: string;

  @Prop({ required: true })
  resource_id: string;

  @Prop({ type: SchemaTypes.Mixed })
  details?: any;
}
export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Appointment extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Tenant', required: true })
  tenant_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Customer', required: true })
  customer_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Staff' })
  staff_id?: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: 'SCHEDULED' })
  status: string;

  @Prop()
  notes?: string;
}
export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Measurement extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Tenant', required: true })
  tenant_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Customer', required: true })
  customer_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  data: any;

  @Prop()
  notes?: string;
}
export const MeasurementSchema = SchemaFactory.createForClass(Measurement);

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class NotificationLog extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Tenant', required: true })
  tenant_id: Types.ObjectId;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  recipient: string;

  @Prop({ required: true })
  status: string;

  @Prop({ type: SchemaTypes.Mixed })
  metadata?: any;

  @Prop({ default: Date.now })
  sent_at: Date;
}
export const NotificationLogSchema = SchemaFactory.createForClass(NotificationLog);
