import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SuperAdminController } from './super-admin.controller.js';
import { SuperAdminService } from './super-admin.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, User } from '../schemas/index.js';
import { TenantSchema, UserSchema } from '../schemas/index.js';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [SuperAdminController],
  providers: [SuperAdminService]
})
export class SuperAdminModule {}
