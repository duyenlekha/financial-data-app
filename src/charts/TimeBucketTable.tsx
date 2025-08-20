import React from 'react';
import { Card, Table } from 'antd';

interface Props {
  /** Array of times as "HH:mm" or "HH:mm:ss" */
  timeData: Array<string | null | undefined>;
  title: string;
}

type Row = { key: number; range: string; count: number };

const TIME_BUCKETS = [
  // 5-minute buckets 09:30–09:59
  { label: '09:30–09:34', startMin: 9 * 60 + 30, endMin: 9 * 60 + 34 },
  { label: '09:35–09:39', startMin: 9 * 60 + 35, endMin: 9 * 60 + 39 },
  { label: '09:40–09:44', startMin: 9 * 60 + 40, endMin: 9 * 60 + 44 },
  { label: '09:45–09:49', startMin: 9 * 60 + 45, endMin: 9 * 60 + 49 },
  { label: '09:50–09:54', startMin: 9 * 60 + 50, endMin: 9 * 60 + 54 },
  { label: '09:55–09:59', startMin: 9 * 60 + 55, endMin: 9 * 60 + 59 },

  // 15-minute buckets 10:00–11:59
  { label: '10:00–10:14', startMin: 10 * 60 + 0, endMin: 10 * 60 + 14 },
  { label: '10:15–10:29', startMin: 10 * 60 + 15, endMin: 10 * 60 + 29 },
  { label: '10:30–10:44', startMin: 10 * 60 + 30, endMin: 10 * 60 + 44 },
  { label: '10:45–10:59', startMin: 10 * 60 + 45, endMin: 10 * 60 + 59 },
  { label: '11:00–11:14', startMin: 11 * 60 + 0,  endMin: 11 * 60 + 14 },
  { label: '11:15–11:29', startMin: 11 * 60 + 15, endMin: 11 * 60 + 29 },
  { label: '11:30–11:44', startMin: 11 * 60 + 30, endMin: 11 * 60 + 44 },
  { label: '11:45–11:59', startMin: 11 * 60 + 45, endMin: 11 * 60 + 59 },

  // 30-minute buckets 12:00–15:59
  { label: '12:00–12:29', startMin: 12 * 60 + 0, endMin: 12 * 60 + 29 },
  { label: '12:30–12:59', startMin: 12 * 60 + 30, endMin: 12 * 60 + 59 },
  { label: '13:00–13:29', startMin: 13 * 60 + 0, endMin: 13 * 60 + 29 },
  { label: '13:30–13:59', startMin: 13 * 60 + 30, endMin: 13 * 60 + 59 },
  { label: '14:00–14:29', startMin: 14 * 60 + 0, endMin: 14 * 60 + 29 },
  { label: '14:30–14:59', startMin: 14 * 60 + 30, endMin: 14 * 60 + 59 },
  { label: '15:00–15:29', startMin: 15 * 60 + 0, endMin: 15 * 60 + 29 },
  { label: '15:30–15:59', startMin: 15 * 60 + 30, endMin: 15 * 60 + 59 },
] as const;

function toMinutes(time: string | null | undefined): number | null {
  if (!time) return null;
  const t = String(time).trim();
  // Accept HH:mm or HH:mm:ss
  if (!/^\d{1,2}:\d{2}(:\d{2})?$/.test(t)) return null;

  const [hh, mm] = t.slice(0, 5).split(':').map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;

  return hh * 60 + mm;
}

const TimeBucketTable: React.FC<Props> = ({ timeData, title }) => {
  const grouped: Row[] = TIME_BUCKETS.map((bucket, idx) => {
    let count = 0;
    for (const t of timeData) {
      const mins = toMinutes(t);
      if (mins !== null && mins >= bucket.startMin && mins <= bucket.endMin) {
        count++;
      }
    }
    return { key: idx, range: bucket.label, count };
  });

  const columns = [
    { title: 'Time Bucket', dataIndex: 'range', key: 'range' },
    { title: 'Count', dataIndex: 'count', key: 'count' },
  ];

  return (
    <Card title={title} style={{ width: '100%' }}>
      <Table<Row>
        columns={columns as any}
        dataSource={grouped}
        pagination={false}
        rowKey="key"
        size="small"
      />
    </Card>
  );
};

export default TimeBucketTable;

