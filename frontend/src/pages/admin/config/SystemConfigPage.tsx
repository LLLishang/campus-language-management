import React from 'react';
import { Card, Form, Input, InputNumber, Select, Button, Typography, message } from 'antd';

const { Title } = Typography;

const SystemConfigPage: React.FC = () => {
  const [form] = Form.useForm();

  const handleSave = () => {
    message.success('配置已保存（演示）');
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <Title level={4}>系统配置</Title>
      <Card>
        <Form form={form} layout="vertical" initialValues={{ system_name: '校园管理系统', ai_provider: 'deepseek', ai_model: 'deepseek-chat', max_tokens: 4096, max_booking_days: 7, max_leave_days: 3 }}>
          <Form.Item label="系统名称" name="system_name"><Input /></Form.Item>
          <Form.Item label="AI 提供商" name="ai_provider"><Select options={[{ label: 'DeepSeek', value: 'deepseek' }, { label: 'Claude', value: 'claude' }]} /></Form.Item>
          <Form.Item label="AI 模型" name="ai_model"><Input /></Form.Item>
          <Form.Item label="Max Tokens" name="max_tokens"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="最大预约提前天数" name="max_booking_days"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="单次请假最大天数" name="max_leave_days"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item><Button type="primary" onClick={handleSave}>保存配置</Button></Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SystemConfigPage;
