import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepairOrder } from './entities/repair-order.entity';
import { RepairLog } from './entities/repair-log.entity';

@Injectable()
export class RepairService {
  constructor(
    @InjectRepository(RepairOrder) private repairRepo: Repository<RepairOrder>,
    @InjectRepository(RepairLog) private logRepo: Repository<RepairLog>,
  ) {}

  async create(userId: number, dto: any) {
    const order = this.repairRepo.create({
      reporter_id: userId,
      title: dto.title,
      description: dto.description,
      location: dto.location,
      category: dto.category,
      urgency: dto.urgency || 'MEDIUM',
      image_urls: dto.imageUrls || [],
      status: 'PENDING',
    });
    const saved = await this.repairRepo.save(order);
    await this.logRepo.save({ repair_order_id: saved.id, operator_id: userId, action: 'ASSIGN' });
    return saved;
  }

  async findMine(userId: number) {
    return this.repairRepo.find({ where: { reporter_id: userId }, order: { created_at: 'DESC' } });
  }

  async findOne(id: number) {
    const order = await this.repairRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('报修工单不存在');
    const logs = await this.logRepo.find({ where: { repair_order_id: id }, order: { created_at: 'DESC' } });
    return { ...order, logs };
  }

  async update(id: number, userId: number, dto: any) {
    const order = await this.repairRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('报修工单不存在');
    if (order.reporter_id !== userId) throw new ForbiddenException('无权修改');
    if (order.status !== 'PENDING') throw new ForbiddenException('只能修改待处理的工单');
    if (dto.title) order.title = dto.title;
    if (dto.description) order.description = dto.description;
    if (dto.category) order.category = dto.category;
    if (dto.urgency) order.urgency = dto.urgency;
    return this.repairRepo.save(order);
  }

  async cancel(id: number, userId: number) {
    const order = await this.repairRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('报修工单不存在');
    if (order.reporter_id !== userId) throw new ForbiddenException('无权撤销');
    order.status = 'CANCELLED';
    await this.logRepo.save({ repair_order_id: id, operator_id: userId, action: 'CANCEL' });
    return this.repairRepo.save(order);
  }

  // 管理员/教师方法
  async findAll(status?: string) {
    const where: any = {};
    if (status) where.status = status;
    return this.repairRepo.find({ where, order: { created_at: 'DESC' } });
  }

  async updateStatus(id: number, operatorId: number, dto: { status: string; comment?: string }) {
    const order = await this.repairRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('报修工单不存在');
    order.status = dto.status;
    if (dto.status === 'COMPLETED') order.completed_at = new Date();
    await this.logRepo.save({ repair_order_id: id, operator_id: operatorId, action: 'UPDATE', comment: dto.comment });
    return this.repairRepo.save(order);
  }

  async assign(id: number, operatorId: number, assignedTo: number) {
    const order = await this.repairRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('报修工单不存在');
    order.status = 'ASSIGNED';
    order.assigned_to = assignedTo;
    await this.logRepo.save({ repair_order_id: id, operator_id: operatorId, action: 'ASSIGN' });
    return this.repairRepo.save(order);
  }
}
