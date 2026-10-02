import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN') // Only SUPER_ADMIN can access these endpoints
export class SuperAdminController {
  constructor(private readonly adminService: SuperAdminService) {}

  @Get('metrics')
  getMetrics() {
    return this.adminService.getGlobalMetrics();
  }

  @Get('tenants')
  getTenants() {
    return this.adminService.getAllTenants();
  }

  @Post('tenants/:id/suspend')
  suspendTenant(@Param('id') tenantId: string) {
    return this.adminService.suspendTenant(tenantId);
  }

  @Post('broadcast')
  broadcast(@Body() body: { subject: string; message: string }) {
    return this.adminService.broadcastMessage(body.subject, body.message);
  }

  @Post('tenants/:id/subscription-override')
  overrideSubscription(@Param('id') tenantId: string, @Body('timeline') timeline: '1Y' | '2Y' | 'LIFETIME') {
    return this.adminService.overrideSubscription(tenantId, timeline);
  }
}
