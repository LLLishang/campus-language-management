import React, { useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Select, Button, Typography, message, Spin, Divider } from 'antd';
import { SaveOutlined, ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import http from '../../../services/http';

const { Title, Text } = Typography;

const SystemConfigPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await http.get('/admin/config');
      form.setFieldsValue(res.data);
    } catch { /* */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchConfig(); }, []);

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      await http.put('/admin/config', values);
      message.success('配置已保存，需重启服务后生效');
    } catch { /* */ }
    finally { setSaving(false); }
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>系统配置</Title>
        <Button icon={<ReloadOutlined />} onClick={fetchConfig} loading={loading}>刷新</Button>
      </div>

      <Card style={{ marginTop: 16 }} loading={loading}>
        <div style={{ marginBottom: 16, padding: '8px 12px', background: '#e6f4ff', borderRadius: 6 }}>
          <InfoCircleOutlined style={{ color: '#1677FF', marginRight: 8 }} />
          <Text type="secondary">部分配置修改后需要重启后端服务才能生效。</Text>
        </div>

        <Form form={form} layout="vertical">
          <Divider orientation="left" plain>基础设置</Divider>
          <Form.Item label="系统名称" name="systemName" rules={[{ required: true }]}>
            <Input placeholder="校园管理系统" />
          </Form.Item>

          <Divider orientation="left" plain>AI 助手配置</Divider>
          <Form.Item label="AI 提供商" name="aiProvider">
            <Select options={[
              { label: 'DeepSeek', value: 'deepseek' },
              { label: 'OpenAI 兼容', value: 'openai' },
              { label: 'Claude', value: 'claude' },
            ]} />
          </Form.Item>
          <Form.Item label="AI 模型" name="aiModel">
            <Input placeholder="deepseek-chat / gpt-4o / claude-3-opus" />
          </Form.Item>
          <Form.Item label="每次对话最大 Token" name="maxTokens">
            <InputNumber min={512} max={32768} style={{ width: '100%' }} />
          </Form.Item>

          <Divider orientation="left" plain>业务规则</Divider>
          <Form.Item label="最大预约提前天数" name="maxBookingDays">
            <InputNumber min={1} max={30} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="单次请假最大天数" name="maxLeaveDays">
            <InputNumber min={1} max={30} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving} size="large">
              保存配置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SystemConfigPage;
