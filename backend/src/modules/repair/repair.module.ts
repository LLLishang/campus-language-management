import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RepairController } from './repair.controller';
import { RepairService } from './repair.service';
import { RepairOrder } from './entities/repair-order.entity';
import { RepairLog } from './entities/repair-log.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RepairOrder, RepairLog]),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'campus-management-jwt-secret-2026', signOptions: { expiresIn: '2h' } }),
    NotificationModule,
  ],
  controllers: [RepairController],
  providers: [RepairService],
  exports: [RepairService],
})
export class RepairModule {}
