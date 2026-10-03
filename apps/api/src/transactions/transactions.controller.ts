import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/transaction.dto.js';

@UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async findAll(
    @Request() req: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50'
  ) {
    return this.transactionsService.findAll(req.user.tenantId, parseInt(page, 10), parseInt(limit, 10));
  }

  @Post()
  async create(@Request() req: any, @Body() body: CreateTransactionDto) {
    return this.transactionsService.create(req.user.tenantId, body);
  }
}
