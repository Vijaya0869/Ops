import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('send')
  async send(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Body() dto: SendNotificationDto,
  ) {
    // The recipient is always the authenticated user's own address — never
    // trust a client-supplied email here, or this endpoint becomes an open
    // mail relay for anyone with a valid session.
    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.userId },
      select: { email: true, fullName: true },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.notificationsService.send(
      { email: user.email, name: user.fullName },
      dto,
    );
    return { sent: true };
  }
}
