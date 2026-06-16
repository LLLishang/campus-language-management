import React, { useEffect, useState } from 'react';
import { Card, Descriptions, DatePicker, Button, Input, InputNumber, message, Spin, Space, Typography } from 'antd';
import { ArrowLeftOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import http from '../../../services/http';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Period { period: number; startTime: string; endTime: string; available: boolean; }
interface VenueDetail { id: number; name: string; category: string; location: string; capacity: number; facilities: string[]; }

const VenueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<VenueDetail | null>(null);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [date, setDate] = useState<Dayjs>(dayjs().add(1, 'day'));
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
  const [purpose, setPurpose] = useState('');
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    http.get(`/venue/${id}`).then((res) => setVenue(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const fetchAvailability = async (d: Dayjs) => {
    try {
      const res = await http.get(`/venue/${id}/availability`, { params: { date: d.format('YYYY-MM-DD') } });
      setPeriods(res.data?.periods || []);
      setSelectedPeriods([]);
    } catch { /* handled */ }
  };

  useEffect(() => { if (id) fetchAvailability(date); }, [date, id]);

  const handlePeriodClick = (p: number) => {
    setSelectedPeriods((prev) => {
      if (prev.includes(p)) return prev.filter((x) => x !== p);
      if (prev.length === 2) return [p];
      if (prev.length === 1) {
        const min = Math.min(prev[0], p); const max = Math.max(prev[0], p);
        return Array.from({ length: max - min + 1 }, (_, i) => min + i);
      }
      return [p];
    });
  };

  const handleSubmit = async () => {
    if (selectedPeriods.length === 0) { message.error('请选择时间段'); return; }
    if (!purpose.trim()) { message.error('请填写用途说明'); return; }
    setSubmitting(true);
    try {
      await http.post(`/venue/${id}/book`, {
        bookingDate: date.format('YYYY-MM-DD'),
        startPeriod: Math.min(...selectedPeriods),
        endPeriod: Math.max(...selectedPeriods),
        purpose,
        attendeeCount: count,
      });
      message.success('预约已提交，请等待审批');
      navigate('/student/bookings');
    } catch { /* handled */ } finally { setSubmitting(false); }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!venue) return <div>场地不存在</div>;

  return (
    <div style={{ maxWidth: 800 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/student/venue')}>返回</Button>
        <Title level={4} style={{ margin: 0 }}>预约 · {venue.name}</Title>
      </Space>

      <Card style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="位置"><EnvironmentOutlined /> {venue.location}</Descriptions.Item>
          <Descriptions.Item label="容纳">{venue.capacity} 人</Descriptions.Item>
          <Descriptions.Item label="设施" span={2}>{(venue.facilities || []).join(' / ') || '无'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="选择日期" style={{ marginBottom: 16 }}>
        <DatePicker value={date} onChange={(d) => d && setDate(d)} disabledDate={(d) => d.isBefore(dayjs(), 'day')} />
      </Card>

      <Card title={`可用时段 · ${date.format('MM月DD日')}`} style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
          {periods.map((p) => (
            <div key={p.period}
              onClick={() => p.available && handlePeriodClick(p.period)}
              style={{
                padding: '8px 12px', borderRadius: 8, textAlign: 'center', cursor: p.available ? 'pointer' : 'not-allowed',
                border: `2px solid ${selectedPeriods.includes(p.period) ? '#1677FF' : p.available ? '#b7eb8f' : '#f0f0f0'}`,
                background: selectedPeriods.includes(p.period) ? '#e6f4ff' : p.available ? '#f6ffed' : '#f5f5f5',
                color: p.available ? '#000' : '#bbb',
              }}>
              <div>第{p.period}节</div>
              <div style={{ fontSize: 11 }}>{p.startTime}-{p.endTime}</div>
              <div style={{ fontSize: 11 }}>{p.available ? '空闲' : '占用'}</div>
            </div>
          ))}
        </div>
        {selectedPeriods.length > 0 && (
          <div style={{ marginTop: 12, padding: 8, background: '#f0f5ff', borderRadius: 6 }}>
            已选：第{Math.min(...selectedPeriods)}节 - 第{Math.max(...selectedPeriods)}节（{selectedPeriods.length}节）
          </div>
        )}
      </Card>

      <Card title="填写信息" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <Text strong>用途说明</Text>
          <TextArea rows={3} value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="请说明预约用途..." maxLength={200} showCount style={{ marginTop: 4 }} />
        </div>
        <div>
          <Text strong>预计人数</Text>
          <InputNumber min={1} max={venue.capacity} value={count} onChange={(v) => setCount(v || 1)} style={{ width: '100%', marginTop: 4 }} />
        </div>
      </Card>

      <Button type="primary" size="large" block onClick={handleSubmit} loading={submitting}>提交预约申请</Button>
    </div>
  );
};

export default VenueDetailPage;
