import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notifService: NotificationService) {}

  @Get()
  findMine(
    @CurrentUser('sub') userId: number,
    @Query('isRead') isRead?: string,
  ) {
    const filter = isRead === 'true' ? true : isRead === 'false' ? false : undefined;
    return this.notifService.findMine(userId, filter);
  }

  @Get('unread-count')
  unreadCount(@CurrentUser('sub') userId: number) {
    return this.notifService.unreadCount(userId);
  }

  @Post(':id/read')
  markRead(@Param('id') id: number, @CurrentUser('sub') userId: number) {
    return this.notifService.markRead(id, userId);
  }

  @Post('read-all')
  markAllRead(@CurrentUser('sub') userId: number) {
    return this.notifService.markAllRead(userId);
  }
}
