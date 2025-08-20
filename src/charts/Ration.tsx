import React from 'react';
import { Card, Table } from 'antd';

type Pair = { idx: number; value: number };

interface Props {
  title: string;
  data: Pair[]; // [{ idx, value }]
  timeHighBeforeLowIndexes?: Set<number>;
  timeLowBeforeHighIndexes?: Set<number>;
}

const PRICE_RANGES = [
    { label: '0.3–0.5', min: 0.3,  max: 0.5 },
    { label: '0.5–0.7', min: 0.5,  max: 0.7 },
    { label: '0.7–1.0', min: 0.7,  max: 1.0 },
    { label: '1.0–1.3', min: 1.0,  max: 1.3 },
    { label: '1.3–1.5', min: 1.3,  max: 1.5 },
    { label: '1.5–2.0', min: 1.5,  max: 2.0 },
    { label: '2.0–2.5', min: 2.0,  max: 2.5 },
    { label: '2.5–3.0', min: 2.5,  max: 3.0 },
    { label: '3.0–3.5', min: 3.0,  max: 3.5 },
    { label: '3.5–4.0', min: 3.5,  max: 4.0 },
    { label: '4.0–4.5', min: 4.0,  max: 4.5 },
    { label: '4.5–5.0',  min: 4.5,  max: 5.0 },
  { label: '5–7',      min: 5.0,  max: 7.0 },
  { label: '7–10',     min: 7.0,  max: 10.0 },
  { label: '10–12',    min: 10.0, max: 12.0 },
  { label: '12–15',    min: 12.0, max: 15.0 },
  { label: '15–20',    min: 15.0, max: 20.0 },
  { label: '20+',      min: 20.0, max: Infinity },
  ];


const inRange = (v: number, min: number, max: number, isFirst: boolean) =>
  isFirst ? v >= min && v <= max : v > min && v <= max;

const Ration: React.FC<Props> = ({
  title,
  data,
  timeHighBeforeLowIndexes,
  timeLowBeforeHighIndexes,
}) => {
  const groupedData = PRICE_RANGES.map((range, index) => {
    let highBeforeLow = 0;
    let lowBeforeHigh = 0;

    for (const { idx, value } of data) {
      if (typeof value !== 'number' || Number.isNaN(value)) continue;
      if (inRange(value, range.min, range.max, index === 0)) {
        if (timeHighBeforeLowIndexes?.has(idx)) highBeforeLow++;
        if (timeLowBeforeHighIndexes?.has(idx)) lowBeforeHigh++;
      }
    }

    const total = highBeforeLow + lowBeforeHigh;

    return { key: index, range: range.label, highBeforeLow, lowBeforeHigh, total };
  });

  const columns = [
    { title: 'Price Range', dataIndex: 'range', key: 'range' },
    {
      title: 'TimeHigh < TimeLow',
      dataIndex: 'highBeforeLow',
      key: 'highPct',
      align: 'right' as const,
      render: (value: number, record: any) => {
        const total = record.total || 0;
        if (!total) return '—';
        const percent = ((value / total) * 100).toFixed(1) + '%';
        return (
          <span>
            {value}{' '}
            <span style={{ color: '#cf1322', fontWeight: 600 }}>
              ({percent})
            </span>
          </span>
        );
      },
      sorter: (a: any, b: any) => {
        const ta = a.total || 1, tb = b.total || 1;
        return a.highBeforeLow / ta - b.highBeforeLow / tb;
      },
    },
    {
      title: 'TimeLow < TimeHigh',
      dataIndex: 'lowBeforeHigh',
      key: 'lowPct',
      align: 'right' as const,
      render: (value: number, record: any) => {
        const total = record.total || 0;
        if (!total) return '—';
        const percent = ((value / total) * 100).toFixed(1) + '%';
        return (
          <span>
            {value}{' '}
            <span style={{ color: '#cf1322', fontWeight: 600 }}>
              ({percent})
            </span>
          </span>
        );
      },
      sorter: (a: any, b: any) => {
        const ta = a.total || 1, tb = b.total || 1;
        return a.lowBeforeHigh / ta - b.lowBeforeHigh / tb;
      },
    },
  ];

  return (
    <Card title={`${title} (percent of row total)`} style={{ width: '100%' }}>
      <Table
        columns={columns}
        dataSource={groupedData}
        pagination={false}
        rowKey="key"
        size="small"
      />
    </Card>
  );
};

export default Ration;