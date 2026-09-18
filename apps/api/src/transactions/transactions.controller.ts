import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';

@UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.transactionsService.findAll(req.user.tenantId);
  }

  @Post()
  async create(@Request() req: any, @Body() body: any) {
    return this.transactionsService.create(req.user.tenantId, body);
  }
}
