import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { LeaveModule } from './modules/leave/leave.module';
import { ApprovalModule } from './modules/approval/approval.module';
import { VenueModule } from './modules/venue/venue.module';
import { RepairModule } from './modules/repair/repair.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'campus_management',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
      charset: 'utf8mb4',
      timezone: '+08:00',
    }),
    ConfigModule,
    AuthModule,
    UserModule,
    LeaveModule,
    ApprovalModule,
    VenueModule,
    RepairModule,
    AdminModule,
  ],
})
export class AppModule {}
