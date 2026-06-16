import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="500"
      title="500"
      subTitle="服务器出了点问题，请稍后再试。"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
      }
    />
  );
};

export default ServerErrorPage;
