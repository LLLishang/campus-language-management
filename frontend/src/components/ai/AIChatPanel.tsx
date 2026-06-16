import React, { useState, useRef, useEffect } from 'react';
import { Drawer, Input, Button, Space, Typography, Spin, Tag } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { streamChat, ChatMessage } from '../../services/ai.service';

const { Text } = Typography;
const { TextArea } = Input;

interface Props {
  open: boolean;
  onClose: () => void;
}

const AIChatPanel: React.FC<Props> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: '你好！我是校园管理系统 AI 助手 🤖\n\n我可以帮你：\n• 查询请假流程\n• 了解场地预约规则\n• 报修流程指引\n• 校园常见问题\n\n请问有什么可以帮你的？' },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    setInput('');
    setStreaming(true);

    let assistantContent = '';
    abortRef.current = streamChat(
      newMessages,
      (delta) => {
        assistantContent += delta;
        setMessages([...newMessages, { role: 'assistant', content: assistantContent }]);
      },
      () => {
        setStreaming(false);
        abortRef.current = null;
      },
      (err) => {
        setMessages([...newMessages, { role: 'assistant', content: `❌ ${err}` }]);
        setStreaming(false);
        abortRef.current = null;
      },
    );
  };

  const handleClear = () => {
    if (streaming) abortRef.current?.abort();
    setMessages([
      { role: 'assistant', content: '对话已清空，有什么可以帮你的？' },
    ]);
    setStreaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Drawer
      title={
        <Space>
          <RobotOutlined style={{ color: '#1677FF' }} />
          <span>AI 助手</span>
          <Tag color="blue" style={{ fontSize: 10 }}>Beta</Tag>
        </Space>
      }
      placement="right"
      width={420}
      open={open}
      onClose={onClose}
      extra={
        <Button
          size="small"
          icon={<DeleteOutlined />}
          onClick={handleClear}
          danger
        >
          清空
        </Button>
      }
      styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', height: 'calc(100% - 55px)' } }}
    >
      {/* 消息列表 */}
      <div
        ref={listRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
          background: '#f5f5f5',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 12,
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius: 12,
                background: msg.role === 'user' ? '#1677FF' : '#fff',
                color: msg.role === 'user' ? '#fff' : '#333',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {i === messages.length - 1 && streaming && msg.role === 'assistant' && !msg.content ? (
                <Spin size="small" />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 输入区域 */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', background: '#fff' }}>
        <Space.Compact style={{ width: '100%' }}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入问题，Enter 发送..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={streaming}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={streaming}
            style={{ height: 'auto' }}
          />
        </Space.Compact>
        <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
          AI 回答仅供参考，请以实际情况为准
        </Text>
      </div>
    </Drawer>
  );
};

export default AIChatPanel;
