import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  BranchesOutlined,
  FileTextOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Header } = Layout;

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '仪表板'
    },
    {
      key: '/workflows',
      icon: <BranchesOutlined />,
      label: '工作流'
    },
    {
      key: '/documents',
      icon: <FileTextOutlined />,
      label: '文档管理'
    },
    {
      key: '/query',
      icon: <SearchOutlined />,
      label: '智能问答'
    }
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录'
    }
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      // Handle logout
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <Header style={{ 
      background: '#fff', 
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          marginRight: '32px',
          color: '#1890ff'
        }}>
          PKU AI工作流平台
        </div>
        <Menu
          mode="horizontal"
          items={menuItems}
          onClick={handleMenuClick}
          style={{ border: 'none', minWidth: '400px' }}
        />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button type="primary" onClick={() => navigate('/workflows')}>
          创建工作流
        </Button>
        
        <Dropdown
          menu={{ 
            items: userMenuItems,
            onClick: handleUserMenuClick 
          }}
          placement="bottomRight"
        >
          <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;