import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface CoursePeriod {
  period_no: number;
  start_time: string;
  end_time: string;
  block: string;
}

interface Props {
  schedule: CoursePeriod[];
  selectedPeriods: number[];
  onPeriodClick: (periodNo: number) => void;
}

const blockColors: Record<string, string> = {
  A: '#E6F7FF', B: '#FFF7E6', C: '#F6FFED', D: '#FFF0F6', E: '#F0F5FF',
};

const blockBorderColors: Record<string, string> = {
  A: '#91CAFF', B: '#FFD591', C: '#B7EB8F', D: '#FFADD2', E: '#ADC6FF',
};

const blockLabels: Record<string, string> = {
  A: '上午 · A块', B: '上午 · B块', C: '下午 · C块', D: '下午 · D块', E: '晚上 · E块',
};

export const CourseScheduleGrid: React.FC<Props> = ({ schedule, selectedPeriods, onPeriodClick }) => {
  const grouped = schedule.reduce((acc, p) => {
    if (!acc[p.block]) acc[p.block] = [];
    acc[p.block].push(p);
    return acc;
  }, {} as Record<string, CoursePeriod[]>);

  const blockOrder = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div>
      {blockOrder.map((block) => {
        const periods = grouped[block];
        if (!periods) return null;
        return (
          <div key={block} style={{ marginBottom: 16 }}>
            <Text strong style={{ fontSize: 13, color: '#555' }}>
              {blockLabels[block]}
            </Text>
            <Row gutter={8} style={{ marginTop: 4 }}>
              {periods.map((p) => {
                const isSelected = selectedPeriods.includes(p.period_no);
                return (
                  <Col span={12} key={p.period_no} style={{ marginBottom: 8 }}>
                    <div
                      onClick={() => onPeriodClick(p.period_no)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        border: `2px solid ${isSelected ? '#1677FF' : blockBorderColors[block] || '#d9d9d9'}`,
                        background: isSelected ? '#E6F4FF' : (blockColors[block] || '#fafafa'),
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: 14 }}>
                          第{p.period_no}节
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <ClockCircleOutlined /> {p.start_time}-{p.end_time}
                        </Text>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        );
      })}
    </div>
  );
};
