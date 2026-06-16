import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Typography, Input, Select, Spin, Empty } from 'antd';
import { SearchOutlined, EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import http from '../../../services/http';

const { Title, Text } = Typography;

interface VenueItem {
  id: number;
  name: string;
  category: string;
  location: string;
  capacity: number;
  facilities: string[];
  is_active: boolean;
}

const categoryMap: Record<string, { color: string; label: string }> = {
  SPORTS: { color: 'cyan', label: '体育' },
  CLASSROOM: { color: 'blue', label: '教室' },
  MEETING: { color: 'purple', label: '会议' },
  LAB: { color: 'green', label: '实验' },
  OTHER: { color: 'default', label: '其他' },
};

const VenueListPage: React.FC = () => {
  const [venues, setVenues] = useState<VenueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('');
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (category) params.category = category;
      if (keyword) params.keyword = keyword;
      const res = await http.get('/venue', { params });
      setVenues(res.data || []);
    } catch { /* handled */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVenues(); }, [category]);

  const handleSearch = () => fetchVenues();

  return (
    <div>
      <Title level={4}>场地预约</Title>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Select
          allowClear placeholder="分类" style={{ width: 120 }}
          value={category || undefined}
          onChange={(v) => setCategory(v || '')}
          options={Object.entries(categoryMap).map(([k, v]) => ({ label: v.label, value: k }))}
        />
        <Input.Search
          placeholder="搜索场地名称/位置"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={handleSearch}
          style={{ maxWidth: 300 }}
          enterButton={<SearchOutlined />}
        />
      </div>

      {loading ? <Spin size="large" style={{ display: 'block', margin: '100px auto' }} /> : (
        venues.length === 0 ? <Empty description="暂无可用场地" /> : (
          <Row gutter={[16, 16]}>
            {venues.map((v) => (
              <Col xs={24} sm={12} lg={8} key={v.id}>
                <Card hoverable onClick={() => navigate(`/student/venue/${v.id}`)}
                  style={{ borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Title level={5} style={{ margin: 0 }}>{v.name}</Title>
                    <Tag color={categoryMap[v.category]?.color}>{categoryMap[v.category]?.label}</Tag>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary"><EnvironmentOutlined /> {v.location}</Text>
                    {v.capacity > 0 && <><br /><Text type="secondary"><TeamOutlined /> 容纳 {v.capacity} 人</Text></>}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )
      )}
    </div>
  );
};

export default VenueListPage;
