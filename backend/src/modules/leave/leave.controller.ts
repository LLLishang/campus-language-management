import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, Role } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('leave')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get('schedule')
  getSchedule() {
    return this.leaveService.getSchedule();
  }

  @Post()
  @Roles(Role.STUDENT)
  create(@CurrentUser('sub') userId: number, @Body() dto: CreateLeaveDto) {
    return this.leaveService.create(userId, dto);
  }

  @Get()
  @Roles(Role.STUDENT)
  findMine(@CurrentUser('sub') userId: number) {
    return this.leaveService.findMine(userId);
  }

  @Get('all')
  findAll() {
    return this.leaveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.leaveService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.STUDENT)
  update(
    @Param('id') id: number,
    @CurrentUser('sub') userId: number,
    @Body() dto: Partial<CreateLeaveDto>,
  ) {
    return this.leaveService.update(id, userId, dto);
  }

  @Delete(':id')
  @Roles(Role.STUDENT)
  cancel(@Param('id') id: number, @CurrentUser('sub') userId: number) {
    return this.leaveService.cancel(id, userId);
  }
}
