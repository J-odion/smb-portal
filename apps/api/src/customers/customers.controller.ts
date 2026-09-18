import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomersService } from './customers.service';

@UseGuards(AuthGuard('jwt'))
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.customersService.findAll(req.user.tenantId);
  }

  @Post()
  async create(@Request() req: any, @Body() body: any) {
    return this.customersService.create(req.user.tenantId, body);
  }
}
