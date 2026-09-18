import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StaffService } from './staff.service';

@UseGuards(AuthGuard('jwt'))
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.staffService.findAll(req.user.tenantId);
  }

  @Post()
  async create(@Request() req: any, @Body() body: any) {
    return this.staffService.create(req.user.tenantId, body);
  }
}
