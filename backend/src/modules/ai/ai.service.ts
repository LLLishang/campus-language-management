import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AiService {
  async *streamChat(
    messages: Array<{ role: string; content: string }>,
  ): AsyncGenerator<string> {
    const provider = process.env.AI_PROVIDER || 'deepseek';
    const apiKey = process.env.AI_API_KEY || '';
    const model = process.env.AI_MODEL || 'deepseek-chat';
    const maxTokens = parseInt(process.env.AI_MAX_TOKENS || '4096');

    // 根据 provider 自动选择 baseUrl
    const providerBaseUrls: Record<string, string> = {
      deepseek: 'https://api.deepseek.com/v1',
      qianwen: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      openai: 'https://api.openai.com/v1',
      claude: 'https://api.anthropic.com/v1',
    };
    const baseUrl = process.env.AI_BASE_URL || providerBaseUrls[provider] || 'https://api.deepseek.com/v1';

    if (!apiKey) {
      yield 'data: ' + JSON.stringify({ choices: [{ delta: { content: '⚠️ 未配置 AI API Key，请在 .env 文件中设置 AI_API_KEY。\n\n支持 DeepSeek / OpenAI 兼容接口。' } }] }) + '\n\n';
      yield 'data: [DONE]\n\n';
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content:
                '你是校园管理系统的 AI 助手，可以帮助学生和教师解决校园生活中的问题，包括请假流程、场地预约、报修流程、课表查询等。请用中文回答，简洁明了。',
            },
            ...messages,
          ],
          max_tokens: maxTokens,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        yield 'data: ' + JSON.stringify({ choices: [{ delta: { content: `❌ AI 服务请求失败 (${response.status})：${errText.slice(0, 200)}` } }] }) + '\n\n';
        yield 'data: [DONE]\n\n';
        return;
      }

      const reader = response.body;
      if (!reader) {
        yield 'data: [DONE]\n\n';
        return;
      }

      // Node.js ReadableStream (fetch 返回的) 异步迭代
      const decoder = new TextDecoder();
      let buffer = '';

      for await (const chunk of reader as unknown as AsyncIterable<Uint8Array>) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') {
            yield 'data: [DONE]\n\n';
            return;
          }
          // 转发原始的 SSE data
          yield `data: ${data}\n\n`;
        }
      }

      // 处理剩余的 buffer
      if (buffer.trim()) {
        const data = buffer.trim().slice(6) || buffer.trim();
        if (data !== '[DONE]') {
          yield `data: ${data}\n\n`;
        }
      }
      yield 'data: [DONE]\n\n';
    } catch (err: any) {
      yield 'data: ' + JSON.stringify({ choices: [{ delta: { content: `❌ 连接 AI 服务失败：${err.message}` } }] }) + '\n\n';
      yield 'data: [DONE]\n\n';
    }
  }
}
