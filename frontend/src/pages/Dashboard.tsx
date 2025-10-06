import React from 'react';
import { Card, Row, Col, Statistic, Button, List, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  BranchesOutlined,
  FileTextOutlined,
  ApiOutlined,
  RocketOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: '创建工作流',
      icon: <BranchesOutlined />,
      description: '使用拖拽界面设计AI处理流程',
      action: () => navigate('/workflows')
    },
    {
      title: '上传文档',
      icon: <FileTextOutlined />,
      description: '上传文档用于知识检索',
      action: () => navigate('/documents')
    },
    {
      title: '智能问答',
      icon: <ApiOutlined />,
      description: '基于文档内容进行智能问答',
      action: () => navigate('/query')
    }
  ];

  const recentWorkflows = [
    { name: '文档摘要工作流', status: '已发布', lastModified: '2024-01-15' },
    { name: '情感分析流程', status: '草稿', lastModified: '2024-01-14' },
    { name: '文本分类器', status: '已发布', lastModified: '2024-01-13' }
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Title level={2}>欢迎使用 PKU AI工作流平台</Title>
      <Paragraph>
        一个强大的AI工作流平台，支持拖拽配置AI流程、文档知识检索、API发布等功能。
      </Paragraph>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="工作流总数"
              value={12}
              prefix={<BranchesOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已发布API"
              value={5}
              prefix={<ApiOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="文档数量"
              value={28}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月执行次数"
              value={1340}
              prefix={<RocketOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        {/* 快速操作 */}
        <Col span={12}>
          <Card title="快速操作" style={{ height: '400px' }}>
            <Row gutter={[16, 16]}>
              {quickActions.map((action, index) => (
                <Col span={24} key={index}>
                  <Card 
                    size="small" 
                    hoverable
                    onClick={action.action}
                    style={{ cursor: 'pointer' }}
                  >
                    <Space>
                      <div style={{ fontSize: '24px', color: '#1890ff' }}>
                        {action.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{action.title}</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>
                          {action.description}
                        </div>
                      </div>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 最近的工作流 */}
        <Col span={12}>
          <Card 
            title="最近的工作流" 
            style={{ height: '400px' }}
            extra={
              <Button 
                type="link" 
                icon={<PlusOutlined />}
                onClick={() => navigate('/workflows')}
              >
                查看全部
              </Button>
            }
          >
            <List
              dataSource={recentWorkflows}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<BranchesOutlined style={{ color: '#1890ff' }} />}
                    title={item.name}
                    description={
                      <Space>
                        <span style={{ 
                          color: item.status === '已发布' ? '#52c41a' : '#faad14' 
                        }}>
                          {item.status}
                        </span>
                        <span style={{ color: '#999' }}>
                          最后修改: {item.lastModified}
                        </span>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;