import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Typography, Modal, Form, Input, Select, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import http from '../../../services/http';

const { Title } = Typography;

const roleMap: Record<string, { color: string; label: string }> = {
  STUDENT: { color: 'blue', label: '学生' },
  TEACHER: { color: 'green', label: '教师' },
  ADMIN: { color: 'orange', label: '管理员' },
};

const UserManagePage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try { const res = await http.get('/admin/users'); setData(res.data || []); } catch { /* */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = () => { setEditUser(null); form.resetFields(); setModalOpen(true); };
  const handleEdit = (user: any) => { setEditUser(user); form.setFieldsValue(user); setModalOpen(true); };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editUser) {
        await http.put(`/admin/users/${editUser.id}`, values);
        message.success('已更新');
      } else {
        await http.post('/admin/users', values);
        message.success('已创建');
      }
      setModalOpen(false);
      fetchData();
    } catch { /* */ }
  };

  const columns = [
    { title: '姓名', dataIndex: 'real_name' },
    { title: '账号', dataIndex: 'username' },
    { title: '角色', dataIndex: 'role', render: (v: string) => <Tag color={roleMap[v]?.color}>{roleMap[v]?.label}</Tag> },
    { title: '手机号', dataIndex: 'phone' },
    { title: '状态', dataIndex: 'is_active', render: (v: number) => <Tag color={v ? 'green' : 'red'}>{v ? '正常' : '禁用'}</Tag> },
    { title: '操作', render: (_: any, r: any) => <Button type="link" onClick={() => handleEdit(r)}>编辑</Button> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>用户管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新增用户</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} />

      <Modal title={editUser ? '编辑用户' : '新增用户'} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleSubmit} width={500}>
        <Form form={form} layout="vertical">
          <Form.Item label="姓名" name="real_name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="账号" name="username" rules={[{ required: true }]}><Input disabled={!!editUser} /></Form.Item>
          {!editUser && <Form.Item label="密码" name="password" rules={[{ required: true, min: 6 }]}><Input.Password placeholder="至少6位" /></Form.Item>}
          <Form.Item label="角色" name="role" rules={[{ required: true }]}>
            <Select options={Object.entries(roleMap).map(([k, v]) => ({ label: v.label, value: k }))} />
          </Form.Item>
          <Form.Item label="手机号" name="phone"><Input /></Form.Item>
          <Form.Item label="邮箱" name="email"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagePage;
