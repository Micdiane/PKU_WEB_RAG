import React, { useState } from 'react';
import { 
  Card, 
  Input, 
  Button, 
  Space, 
  Spin, 
  Alert, 
  Typography, 
  Divider,
  Tag,
  List,
  Slider
} from 'antd';
import { 
  SearchOutlined, 
  FileTextOutlined,
  QuestionCircleOutlined 
} from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

interface QueryResult {
  answer: string;
  sources: Array<{
    document_id: string;
    document_title: string;
    chunk_content: string;
    similarity: number;
  }>;
  confidence: number;
}

const QueryInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [topK, setTopK] = useState(5);

  const sampleQueries = [
    "什么是人工智能？",
    "机器学习的主要算法有哪些？",
    "深度学习和传统机器学习的区别是什么？",
    "如何评估模型的性能？"
  ];

  const handleQuery = async () => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      const mockResult: QueryResult = {
        answer: `基于您的查询"${query}"，我在文档中找到了相关信息。人工智能是一门研究如何让计算机模拟人类智能行为的科学技术。它包括机器学习、深度学习、自然语言处理、计算机视觉等多个子领域。

AI技术的核心目标是让机器能够像人类一样思考、学习和决策。目前AI在图像识别、语音识别、自然语言理解等方面已经取得了显著进展。`,
        sources: [
          {
            document_id: "1",
            document_title: "AI技术白皮书",
            chunk_content: "人工智能（Artificial Intelligence，AI）是计算机科学的一个分支，它企图了解智能的实质，并生产出一种新的能以人类智能相似的方式做出反应的智能机器...",
            similarity: 0.92
          },
          {
            document_id: "2", 
            document_title: "机器学习基础",
            chunk_content: "机器学习是人工智能的一个重要分支，它通过算法让计算机系统能够自动学习和改进，而无需显式编程...",
            similarity: 0.85
          },
          {
            document_id: "3",
            document_title: "深度学习原理",
            chunk_content: "深度学习是机器学习的一个子集，它模仿人脑神经网络的结构和功能，通过多层神经网络来学习数据的表征...",
            similarity: 0.78
          }
        ],
        confidence: 0.89
      };
      
      setResult(mockResult);
      setLoading(false);
    }, 2000);
  };

  const handleSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#52c41a';
    if (confidence >= 0.6) return '#faad14';
    return '#ff4d4f';
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.8) return 'green';
    if (similarity >= 0.6) return 'orange';
    return 'red';
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>
        <QuestionCircleOutlined style={{ marginRight: '8px' }} />
        智能问答
      </Title>
      <Paragraph>
        基于您上传的文档进行智能问答，系统会检索相关内容并生成答案。
      </Paragraph>

      {/* 查询输入区域 */}
      <Card style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>您的问题：</Text>
          </div>
          <TextArea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="请输入您的问题..."
            rows={3}
            showCount
            maxLength={500}
          />
          
          <div>
            <Text>检索结果数量：</Text>
            <Slider
              min={1}
              max={10}
              value={topK}
              onChange={setTopK}
              style={{ width: '200px', marginLeft: '16px' }}
              marks={{ 1: '1', 5: '5', 10: '10' }}
            />
          </div>
          
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleQuery}
              loading={loading}
              disabled={!query.trim()}
            >
              提问
            </Button>
            <Button onClick={() => { setQuery(''); setResult(null); }}>
              清空
            </Button>
          </Space>
        </Space>
      </Card>

      {/* 示例问题 */}
      <Card title="示例问题" style={{ marginBottom: '24px' }}>
        <Space wrap>
          {sampleQueries.map((sampleQuery, index) => (
            <Button
              key={index}
              type="link"
              onClick={() => handleSampleQuery(sampleQuery)}
            >
              {sampleQuery}
            </Button>
          ))}
        </Space>
      </Card>

      {/* 结果显示区域 */}
      {loading && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>
              正在检索相关文档并生成答案...
            </div>
          </div>
        </Card>
      )}

      {result && !loading && (
        <Card title="查询结果">
          {/* 置信度指示 */}
          <Alert
            message={
              <Space>
                <span>置信度: </span>
                <Tag color={getConfidenceColor(result.confidence)}>
                  {(result.confidence * 100).toFixed(1)}%
                </Tag>
              </Space>
            }
            type={result.confidence >= 0.7 ? 'success' : result.confidence >= 0.4 ? 'warning' : 'error'}
            style={{ marginBottom: '16px' }}
          />

          {/* 答案 */}
          <div className="query-result">
            <Title level={4}>答案</Title>
            <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
              {result.answer}
            </Paragraph>
          </div>

          <Divider />

          {/* 信息源 */}
          <Title level={4}>
            <FileTextOutlined style={{ marginRight: '8px' }} />
            参考来源
          </Title>
          <List
            dataSource={result.sources}
            renderItem={(source, index) => (
              <List.Item className="source-item">
                <List.Item.Meta
                  title={
                    <Space>
                      <span>{source.document_title}</span>
                      <Tag color={getSimilarityColor(source.similarity)}>
                        相似度: {(source.similarity * 100).toFixed(1)}%
                      </Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <Text>{source.chunk_content}</Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* 使用提示 */}
      <Card title="使用提示" style={{ marginTop: '24px' }}>
        <List
          size="small"
          dataSource={[
            '请确保您已上传相关文档并完成索引',
            '问题描述越具体，答案质量越高',
            '系统会基于文档内容生成答案，准确性取决于文档质量',
            '您可以调整检索结果数量来获得更多或更精确的信息'
          ]}
          renderItem={(item) => (
            <List.Item>
              <Text type="secondary">• {item}</Text>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default QueryInterface;