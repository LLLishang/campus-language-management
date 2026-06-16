import React, { useState } from 'react';
import { Button } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import AIChatPanel from './AIChatPanel';

const AIFloatButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<RobotOutlined style={{ fontSize: 22 }} />}
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          width: 56,
          height: 56,
          boxShadow: '0 4px 16px rgba(22, 119, 255, 0.4)',
          zIndex: 1000,
        }}
      />
      <AIChatPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default AIFloatButton;
