import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service.js';

@UseGuards(AuthGuard('jwt'))
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.inventoryService.findAll(req.user.tenantId);
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.inventoryService.findOne(req.user.tenantId, id);
  }

  @Post()
  async create(@Request() req: any, @Body() body: any) {
    return this.inventoryService.create(req.user.tenantId, body);
  }

  @Put(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.inventoryService.update(req.user.tenantId, id, body);
  }

  @Delete(':id')
  async delete(@Request() req: any, @Param('id') id: string) {
    return this.inventoryService.delete(req.user.tenantId, id);
  }
}
