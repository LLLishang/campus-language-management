import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RepairService } from './repair.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('repair')
@UseGuards(JwtAuthGuard)
export class RepairController {
  constructor(private readonly repairService: RepairService) {}

  @Post()
  create(@CurrentUser('sub') userId: number, @Body() dto: any) {
    return this.repairService.create(userId, dto);
  }

  @Get('all')
  findAll(@Query('status') status?: string) {
    return this.repairService.findAll(status);
  }

  @Get()
  findMine(@CurrentUser('sub') userId: number) {
    return this.repairService.findMine(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.repairService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @CurrentUser('sub') userId: number, @Body() dto: any) {
    return this.repairService.update(id, userId, dto);
  }

  @Delete(':id')
  cancel(@Param('id') id: number, @CurrentUser('sub') userId: number) {
    return this.repairService.cancel(id, userId);
  }

  @Post(':id/assign')
  assign(@Param('id') id: number, @CurrentUser('sub') operatorId: number, @Body('assignedTo') assignedTo: number) {
    return this.repairService.assign(id, operatorId, assignedTo);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: number, @CurrentUser('sub') operatorId: number, @Body() dto: { status: string; comment?: string }) {
    return this.repairService.updateStatus(id, operatorId, dto);
  }
}
