import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, Role } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('approval')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TEACHER)
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  @Get('pending')
  getPending(@CurrentUser('sub') userId: number) {
    return this.approvalService.getPending(userId);
  }

  @Post('leave/:id/approve')
  approveLeave(@Param('id') id: number, @CurrentUser('sub') userId: number) {
    return this.approvalService.approveLeave(id, userId);
  }

  @Post('leave/:id/reject')
  rejectLeave(
    @Param('id') id: number,
    @CurrentUser('sub') userId: number,
    @Body('comment') comment?: string,
  ) {
    return this.approvalService.rejectLeave(id, userId, comment);
  }

  @Post('booking/:id/approve')
  approveBooking() {
    return { message: '功能开发中' };
  }

  @Post('booking/:id/reject')
  rejectBooking() {
    return { message: '功能开发中' };
  }
}
