import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SyncService } from './sync.service';

@UseGuards(AuthGuard('jwt'))
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  async handleSync(@Request() req: any, @Body() body: any) {
    return this.syncService.syncOfflineData(req.user.tenantId, body);
  }
}
