import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service.js';
import { ExpensesController } from './expenses.controller.js';

@Module({
  providers: [ExpensesService],
  controllers: [ExpensesController]
})
export class ExpensesModule {}
