import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您没有权限访问此页面"
      extra={<Button type="primary" onClick={() => navigate('/login')}>返回登录</Button>}
    />
  );
};

export default ForbiddenPage;
