import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Tag, Typography, Modal, Form, Input, InputNumber, Select, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import http from '../../../services/http';

const { Title, Text } = Typography;

const categoryMap: Record<string, string> = { SPORTS: '体育', CLASSROOM: '教室', MEETING: '会议', LAB: '实验', OTHER: '其他' };

const VenueManagePage: React.FC = () => {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try { const res = await http.get('/admin/venues'); setVenues(res.data || []); } catch { /* */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = () => { setEditItem(null); form.resetFields(); form.setFieldsValue({ is_active: true, open_periods: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }); setModalOpen(true); };
  const handleEdit = (v: any) => { setEditItem(v); form.setFieldsValue(v); setModalOpen(true); };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editItem) await http.put(`/admin/venues/${editItem.id}`, values);
      else await http.post('/admin/venues', values);
      message.success(editItem ? '已更新' : '已创建');
      setModalOpen(false); fetchData();
    } catch { /* */ }
  };

  const handleDelete = async (id: number) => {
    try { await http.delete(`/admin/venues/${id}`); message.success('已删除'); fetchData(); } catch { /* */ }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between', display: 'flex' }}>
        <Title level={4} style={{ margin: 0 }}>场地管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新增场地</Button>
      </Space>
      <Row gutter={[16, 16]}>
        {venues.map((v) => (
          <Col xs={24} sm={12} lg={8} key={v.id}>
            <Card actions={[
              <EditOutlined key="edit" onClick={() => handleEdit(v)} />,
              <DeleteOutlined key="delete" onClick={() => handleDelete(v.id)} />,
            ]}>
              <Title level={5}>{v.name}</Title>
              <Tag>{categoryMap[v.category]}</Tag>
              <Text type="secondary"> · {v.location}</Text>
              <br /><Text type="secondary">容纳：{v.capacity}人 · {v.is_active ? '开放' : '维护中'}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal title={editItem ? '编辑场地' : '新增场地'} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleSubmit} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item label="名称" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="类别" name="category" rules={[{ required: true }]}>
            <Select options={Object.entries(categoryMap).map(([k, v]) => ({ label: v, value: k }))} />
          </Form.Item>
          <Form.Item label="位置" name="location" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="容纳人数" name="capacity"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="是否开放" name="is_active" valuePropName="checked"><Select options={[{ label: '开放', value: true }, { label: '维护中', value: false }]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VenueManagePage;
