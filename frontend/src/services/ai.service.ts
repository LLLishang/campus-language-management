import http from './http';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** SSE 流式聊天：传入消息列表，返回每个 delta 片段的回调 */
export function streamChat(
  messages: ChatMessage[],
  onDelta: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
): AbortController {
  const controller = new AbortController();
  const token = localStorage.getItem('accessToken') || '';

  fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        onError(`请求失败 (${response.status})`);
        return;
      }
      const reader = response.body?.getReader();
      if (!reader) {
        onDone();
        return;
      }
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (!trimmed.startsWith('data: ')) continue;
          try {
            const json = JSON.parse(trimmed.slice(6));
            const text = json.choices?.[0]?.delta?.content;
            if (text) onDelta(text);
          } catch {
            // 忽略解析错误
          }
        }
      }
      onDone();
    })
    .catch((err) => {
      if (err.name !== 'AbortError') {
        onError(err.message);
      }
    });

  return controller;
}
