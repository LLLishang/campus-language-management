import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'campus-management-jwt-secret-2026',
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
