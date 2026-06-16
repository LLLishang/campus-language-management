import React, { useEffect, useState } from 'react';
import { Form, Select, DatePicker, Button, Input, message, Card, Row, Col, Typography, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import http from '../../../services/http';
import { CourseScheduleGrid } from '../../../components/leave/CourseScheduleGrid';

const { Title } = Typography;
const { TextArea } = Input;

interface CoursePeriod {
  period_no: number;
  start_time: string;
  end_time: string;
  block: string;
}

const LeaveCreatePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<CoursePeriod[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const navigate = useNavigate();

  useEffect(() => {
    http.get('/leave/schedule').then((res) => setSchedule(res.data || [])).catch(() => {});
  }, []);

  const handlePeriodClick = (periodNo: number) => {
    setSelectedPeriods((prev) => {
      if (prev.includes(periodNo)) return prev.filter((p) => p !== periodNo);
      // 连续选中逻辑
      if (prev.length === 2) return [periodNo];
      if (prev.length === 1) {
        const min = Math.min(prev[0], periodNo);
        const max = Math.max(prev[0], periodNo);
        const range = [];
        for (let i = min; i <= max; i++) range.push(i);
        return range;
      }
      return [periodNo];
    });
  };

  const onFinish = async (values: any) => {
    if (selectedPeriods.length === 0) {
      message.error('请选择请假时间段');
      return;
    }
    setLoading(true);
    try {
      await http.post('/leave', {
        leaveType: values.leaveType,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        startPeriod: Math.min(...selectedPeriods),
        endPeriod: Math.max(...selectedPeriods),
        reason: values.reason,
      });
      message.success('请假申请已提交');
      navigate('/student/leave');
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/student/leave')}>返回</Button>
        <Title level={4} style={{ margin: 0 }}>新建请假申请</Title>
      </Space>

      <Form form={form} layout="vertical" onFinish={onFinish}
        initialValues={{ leaveType: 'SICK', dateRange: [dayjs(), dayjs()] }}>
        <Form.Item label="请假类型" name="leaveType" rules={[{ required: true }]}>
          <Select options={[
            { label: '病假', value: 'SICK' },
            { label: '事假', value: 'PERSONAL' },
            { label: '其他', value: 'OTHER' },
          ]} />
        </Form.Item>

        <Form.Item label="请假日期" name="dateRange" rules={[{ required: true }]}>
          <DatePicker.RangePicker
            onChange={(dates) => { if (dates?.[0]) setSelectedDate(dates[0]); }}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Card title={`📅 课程时间表 · ${selectedDate.format('YYYY年MM月DD日')}`} style={{ marginBottom: 16 }}>
          <CourseScheduleGrid
            schedule={schedule}
            selectedPeriods={selectedPeriods}
            onPeriodClick={handlePeriodClick}
          />
          {selectedPeriods.length > 0 && (
            <div style={{ marginTop: 12, padding: '8px 12px', background: '#f0f5ff', borderRadius: 6 }}>
              已选时段：第{Math.min(...selectedPeriods)}节 - 第{Math.max(...selectedPeriods)}节
              （共 {selectedPeriods.length} 节课）
              {schedule.length > 0 && (() => {
                const start = schedule.find(s => s.period_no === Math.min(...selectedPeriods));
                const end = schedule.find(s => s.period_no === Math.max(...selectedPeriods));
                return start && end ? ` · ${start.start_time}-${end.end_time}` : '';
              })()}
            </div>
          )}
        </Card>

        <Form.Item label="请假事由" name="reason" rules={[{ required: true, min: 5, message: '至少输入5个字' }]}>
          <TextArea rows={4} placeholder="请详细描述请假原因..." maxLength={500} showCount />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            提交申请
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LeaveCreatePage;
