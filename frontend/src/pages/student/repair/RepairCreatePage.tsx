import React, { useState } from 'react';
import { Form, Input, Select, Button, Typography, message, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import http from '../../../services/http';

const { Title } = Typography;
const { TextArea } = Input;

const RepairCreatePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await http.post('/repair', values);
      message.success('报修已提交');
      navigate('/student/repair');
    } catch { /* handled */ } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/student/repair')}>返回</Button>
        <Title level={4} style={{ margin: 0 }}>新建报修</Title>
      </Space>
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ urgency: 'MEDIUM', category: 'ELECTRICAL' }}>
        <Form.Item label="报修标题" name="title" rules={[{ required: true, min: 2, max: 50 }]}>
          <Input placeholder="如：教室空调不制冷" />
        </Form.Item>
        <Form.Item label="报修类别" name="category" rules={[{ required: true }]}>
          <Select options={[
            { label: '电器', value: 'ELECTRICAL' }, { label: '水暖', value: 'PLUMBING' },
            { label: '家具', value: 'FURNITURE' }, { label: '网络/IT', value: 'IT' },
            { label: '建筑', value: 'BUILDING' }, { label: '其他', value: 'OTHER' },
          ]} />
        </Form.Item>
        <Form.Item label="紧急程度" name="urgency" rules={[{ required: true }]}>
          <Select options={[
            { label: '低', value: 'LOW' }, { label: '中', value: 'MEDIUM' },
            { label: '高', value: 'HIGH' }, { label: '紧急', value: 'URGENT' },
          ]} />
        </Form.Item>
        <Form.Item label="位置描述" name="location" rules={[{ required: true, min: 2, max: 100 }]}>
          <Input placeholder="如：博学楼301教室" />
        </Form.Item>
        <Form.Item label="详细描述" name="description" rules={[{ required: true, min: 10, max: 1000 }]}>
          <TextArea rows={4} placeholder="请详细描述故障情况..." maxLength={1000} showCount />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large">提交报修</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RepairCreatePage;
