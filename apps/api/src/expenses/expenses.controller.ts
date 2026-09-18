import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExpensesService } from './expenses.service';

@UseGuards(AuthGuard('jwt'))
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.expensesService.findAll(req.user.tenantId);
  }

  @Post()
  async create(@Request() req: any, @Body() body: any) {
    return this.expensesService.create(req.user.tenantId, body);
  }
}
