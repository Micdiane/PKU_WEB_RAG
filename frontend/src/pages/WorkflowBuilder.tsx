import React, { useState, useCallback } from 'react';
import { Layout, Card, Button, Space, message, Modal, Form, Input, Select } from 'antd';
import { 
  PlayCircleOutlined, 
  SaveOutlined, 
  ShareAltOutlined,
  PlusOutlined 
} from '@ant-design/icons';

const { Sider, Content } = Layout;
const { TextArea } = Input;

// 模拟节点类型
const nodeTypes = [
  { type: 'input', label: '输入节点', description: '接收输入数据' },
  { type: 'text-process', label: '文本处理', description: '处理文本数据' },
  { type: 'rag-search', label: 'RAG检索', description: '基于文档进行检索' },
  { type: 'ai-generate', label: 'AI生成', description: '使用AI生成内容' },
  { type: 'output', label: '输出节点', description: '输出结果数据' }
];

interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  config?: any;
}

const WorkflowBuilder: React.FC = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    const type = event.dataTransfer.getData('application/reactflow');
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type,
      label: nodeTypes.find(n => n.type === type)?.label || type,
      position,
    };

    setNodes(prev => [...prev, newNode]);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleSaveWorkflow = () => {
    const workflowData = {
      nodes,
      edges: [], // 简化版本，实际需要连接信息
      name: 'My Workflow',
      description: 'A sample workflow'
    };
    
    console.log('Saving workflow:', workflowData);
    message.success('工作流已保存');
  };

  const handleRunWorkflow = () => {
    message.info('工作流开始执行...');
    // 模拟执行
    setTimeout(() => {
      message.success('工作流执行完成');
    }, 2000);
  };

  const handlePublishWorkflow = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('Publishing workflow:', values);
      message.success('工作流已发布为API');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <Layout style={{ height: 'calc(100vh - 64px)' }}>
      {/* 节点面板 */}
      <Sider width={250} theme="light">
        <div className="node-panel">
          <h3>节点库</h3>
          {nodeTypes.map((nodeType) => (
            <div
              key={nodeType.type}
              className="node-item"
              draggable
              onDragStart={(e) => onDragStart(e, nodeType.type)}
            >
              <div style={{ fontWeight: 'bold' }}>{nodeType.label}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {nodeType.description}
              </div>
            </div>
          ))}
        </div>
      </Sider>

      {/* 主工作区 */}
      <Layout>
        {/* 工具栏 */}
        <div className="workflow-toolbar">
          <Space>
            <Button 
              type="primary" 
              icon={<PlayCircleOutlined />}
              onClick={handleRunWorkflow}
            >
              运行
            </Button>
            <Button 
              icon={<SaveOutlined />}
              onClick={handleSaveWorkflow}
            >
              保存
            </Button>
            <Button 
              icon={<ShareAltOutlined />}
              onClick={handlePublishWorkflow}
            >
              发布API
            </Button>
          </Space>
          
          <Space>
            <Button icon={<PlusOutlined />}>新建工作流</Button>
          </Space>
        </div>

        {/* 画布区域 */}
        <Content>
          <div 
            className="workflow-canvas"
            onDrop={onDrop}
            onDragOver={onDragOver}
            style={{ position: 'relative' }}
          >
            {nodes.length === 0 && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: '#999'
              }}>
                <h3>拖拽节点到此处开始构建工作流</h3>
                <p>从左侧节点库拖拽节点到画布上</p>
              </div>
            )}
            
            {/* 渲染节点 */}
            {nodes.map((node) => (
              <Card
                key={node.id}
                size="small"
                style={{
                  position: 'absolute',
                  left: node.position.x,
                  top: node.position.y,
                  width: 160,
                  cursor: 'pointer',
                  border: selectedNode?.id === node.id ? '2px solid #1890ff' : '1px solid #d9d9d9'
                }}
                onClick={() => setSelectedNode(node)}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '12px' }}>
                    {node.label}
                  </div>
                  <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                    {node.type}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Content>
      </Layout>

      {/* 发布API对话框 */}
      <Modal
        title="发布工作流为API"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="API名称"
            rules={[{ required: true, message: '请输入API名称' }]}
          >
            <Input placeholder="输入API名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="API描述"
          >
            <TextArea placeholder="描述API功能" rows={3} />
          </Form.Item>
          
          <Form.Item
            name="version"
            label="版本"
            initialValue="1.0.0"
          >
            <Input placeholder="版本号" />
          </Form.Item>
          
          <Form.Item
            name="access_level"
            label="访问级别"
            initialValue="private"
          >
            <Select>
              <Select.Option value="private">私有</Select.Option>
              <Select.Option value="public">公开</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default WorkflowBuilder;