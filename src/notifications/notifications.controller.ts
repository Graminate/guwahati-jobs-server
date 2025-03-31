import { Controller, Get, Put, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.notificationsService.findByUser(+userId);
  }

  @Put(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(+id);
  }
}
