import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';

@UseGuards(AuthGuard('jwt'))
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.paymentsService.findAll(req.user.tenantId);
  }

  @Post()
  async create(@Request() req: any, @Body() body: any) {
    return this.paymentsService.create(req.user.tenantId, body);
  }
}
