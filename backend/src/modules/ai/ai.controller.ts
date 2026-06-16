import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(
    @Body() dto: { messages: Array<{ role: string; content: string }> },
    @Res() res: Response,
  ) {
    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    try {
      for await (const chunk of this.aiService.streamChat(dto.messages || [])) {
        res.write(chunk);
      }
    } catch (err: any) {
      res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: `❌ 服务异常：${err.message}` } }] })}\n\n`);
      res.write('data: [DONE]\n\n');
    }
    res.end();
  }
}
