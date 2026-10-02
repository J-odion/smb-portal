import { Controller, Get, Put, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { TenantService } from './tenant.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('profile')
  getProfile(@Req() req: any) {
    return this.tenantService.getProfile(req.user.tenantId);
  }

  @Roles('OWNER', 'MANAGER')
  @Put('industry')
  updateIndustry(@Req() req: any, @Body('industry') industry: string) {
    return this.tenantService.updateIndustry(req.user.tenantId, industry);
  }

  @Roles('OWNER')
  @Put('subscription')
  updateSubscription(@Req() req: any, @Body('tier') tier: string) {
    return this.tenantService.updateSubscription(req.user.tenantId, tier);
  }

  @Roles('OWNER', 'MANAGER')
  @Post('users')
  inviteUser(@Req() req: any, @Body('email') email: string, @Body('role') role: string) {
    return this.tenantService.inviteUser(req.user.tenantId, email, role);
  }

  @Roles('OWNER', 'MANAGER')
  @Delete('users/:id')
  removeUser(@Req() req: any, @Param('id') userId: string) {
    return this.tenantService.removeUser(req.user.tenantId, userId);
  }
}

