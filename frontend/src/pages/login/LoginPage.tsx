import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Segmented, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<string>('STUDENT');
  const loginAction = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      await loginAction(values.username, values.password, role);
      message.success('登录成功');
      const routeMap: Record<string, string> = {
        STUDENT: '/student/dashboard',
        TEACHER: '/teacher/dashboard',
        ADMIN: '/admin/dashboard',
      };
      navigate(routeMap[role], { replace: true });
    } catch {
      // 错误已在拦截器中处理
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        style={{ width: 420, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
        styles={{ body: { padding: '40px 32px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 4 }}>🏫 校园管理系统</Title>
          <Text type="secondary">统一校园服务管理平台</Text>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Segmented
            size="large"
            options={[
              { label: '🎓 学生', value: 'STUDENT' },
              { label: '👨‍🏫 教师', value: 'TEACHER' },
              { label: '⚙️ 管理员', value: 'ADMIN' },
            ]}
            value={role}
            onChange={(val) => setRole(val as string)}
            block
          />
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          size="large"
          initialValues={
            role === 'ADMIN'
              ? { username: 'admin', password: 'admin123' }
              : role === 'TEACHER'
                ? { username: '13800138004', password: '123456' }
                : { username: '13800138001', password: '123456' }
          }
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="账号（手机号/用户名）" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {role === 'ADMIN'
                ? '默认管理员: admin / admin123'
                : '测试账号: 13800138001 / 123456'}
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
