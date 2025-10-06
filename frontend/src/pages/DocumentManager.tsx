import React, { useState } from 'react';
import { 
  Card, 
  Upload, 
  Button, 
  Table, 
  Space, 
  message, 
  Modal, 
  Progress,
  Tag,
  Popconfirm 
} from 'antd';
import { 
  UploadOutlined, 
  EyeOutlined, 
  DeleteOutlined,
  SearchOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import type { UploadProps, ColumnsType } from 'antd';

interface Document {
  id: string;
  title: string;
  filename: string;
  size: number;
  uploadDate: string;
  status: 'uploaded' | 'indexing' | 'indexed';
  type: string;
}

const DocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      title: 'AI技术白皮书',
      filename: 'ai-whitepaper.pdf',
      size: 2048000,
      uploadDate: '2024-01-15',
      status: 'indexed',
      type: 'PDF'
    },
    {
      id: '2',
      title: '产品需求文档',
      filename: 'product-requirements.docx',
      size: 1024000,
      uploadDate: '2024-01-14',
      status: 'indexing',
      type: 'DOCX'
    },
    {
      id: '3',
      title: '用户手册',
      filename: 'user-manual.txt',
      size: 512000,
      uploadDate: '2024-01-13',
      status: 'uploaded',
      type: 'TXT'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'indexed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'indexing':
        return <SyncOutlined spin style={{ color: '#1890ff' }} />;
      default:
        return <FileTextOutlined style={{ color: '#faad14' }} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'indexed':
        return <Tag color="success">已索引</Tag>;
      case 'indexing':
        return <Tag color="processing">索引中</Tag>;
      default:
        return <Tag color="warning">未索引</Tag>;
    }
  };

  const handleUpload: UploadProps['customRequest'] = ({ file, onSuccess, onError }) => {
    // 模拟上传过程
    setTimeout(() => {
      const newDoc: Document = {
        id: Date.now().toString(),
        title: (file as File).name.split('.')[0],
        filename: (file as File).name,
        size: (file as File).size,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'uploaded',
        type: (file as File).name.split('.').pop()?.toUpperCase() || 'UNKNOWN'
      };
      
      setDocuments(prev => [newDoc, ...prev]);
      message.success(`${(file as File).name} 上传成功`);
      onSuccess?.(newDoc);
    }, 1000);
  };

  const handleIndex = (document: Document) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === document.id 
          ? { ...doc, status: 'indexing' }
          : doc
      )
    );
    
    message.info('开始索引文档...');
    
    // 模拟索引过程
    setTimeout(() => {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === document.id 
            ? { ...doc, status: 'indexed' }
            : doc
        )
      );
      message.success('文档索引完成');
    }, 3000);
  };

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    message.success('文档已删除');
  };

  const handleView = (document: Document) => {
    setSelectedDocument(document);
    setIsModalVisible(true);
  };

  const columns: ColumnsType<Document> = [
    {
      title: '文档',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          {getStatusIcon(record.status)}
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.filename}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size) => formatFileSize(size),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag>{type}</Tag>,
    },
    {
      title: '上传时间',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusText(status),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          {record.status === 'uploaded' && (
            <Button 
              type="link" 
              icon={<SearchOutlined />}
              onClick={() => handleIndex(record)}
            >
              索引
            </Button>
          )}
          <Popconfirm
            title="确定要删除这个文档吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="文档管理" style={{ marginBottom: '24px' }}>
        <div className="upload-area" style={{ marginBottom: '24px' }}>
          <Upload
            customRequest={handleUpload}
            showUploadList={false}
            multiple
            accept=".txt,.doc,.docx,.pdf"
          >
            <div>
              <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              <div style={{ marginTop: '16px' }}>
                <Button type="primary" icon={<UploadOutlined />}>
                  选择文件上传
                </Button>
              </div>
              <div style={{ marginTop: '8px', color: '#666' }}>
                支持 TXT、DOC、DOCX、PDF 格式，单个文件不超过 10MB
              </div>
            </div>
          </Upload>
        </div>

        <Table
          columns={columns}
          dataSource={documents}
          rowKey="id"
          pagination={{
            total: documents.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>

      {/* 文档预览模态框 */}
      <Modal
        title={selectedDocument?.title}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedDocument && (
          <div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <strong>文件名：</strong> {selectedDocument.filename}
              </div>
              <div>
                <strong>大小：</strong> {formatFileSize(selectedDocument.size)}
              </div>
              <div>
                <strong>类型：</strong> {selectedDocument.type}
              </div>
              <div>
                <strong>上传时间：</strong> {selectedDocument.uploadDate}
              </div>
              <div>
                <strong>状态：</strong> {getStatusText(selectedDocument.status)}
              </div>
              
              {selectedDocument.status === 'indexing' && (
                <div>
                  <strong>索引进度：</strong>
                  <Progress percent={65} status="active" />
                </div>
              )}
              
              <div style={{ 
                background: '#f5f5f5', 
                padding: '16px', 
                borderRadius: '4px',
                marginTop: '16px'
              }}>
                <strong>文档预览：</strong>
                <div style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                  这里显示文档内容的预览...
                  {/* 实际实现中这里会显示真实的文档内容 */}
                </div>
              </div>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DocumentManager;