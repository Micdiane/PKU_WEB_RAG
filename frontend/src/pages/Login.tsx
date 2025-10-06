import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    
    // 模拟登录API调用
    setTimeout(() => {
      // 模拟成功登录
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        username: values.username,
        email: `${values.username}@example.com`
      }));
      
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <Card style={{ width: '400px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            PKU AI工作流平台
          </Title>
          <Paragraph type="secondary">
            一站式AI工作流开发与部署平台
          </Paragraph>
        </div>

        <Alert
          message="演示账号"
          description="用户名: admin, 密码: 任意密码"
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%' }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Space direction="vertical">
            <Paragraph type="secondary" style={{ margin: 0 }}>
              还没有账号？ <a href="#register">注册账号</a>
            </Paragraph>
            <Paragraph type="secondary" style={{ margin: 0 }}>
              <a href="#forgot">忘记密码？</a>
            </Paragraph>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Login;