import React from 'react';
import { Card, Table } from 'antd';

type Pair = { idx: number; value: number };

interface Props {
  premarketDollarData: Pair[]; // [{ idx, value }]
  timeHighBeforeLowIndexes?: Set<number>;
  timeLowBeforeHighIndexes?: Set<number>;
}

const RANGES = [
  { label: '0–2M',     min: 0,            max: 2_000_000 },
  { label: '2M–5M',    min: 2_000_000,    max: 5_000_000 },
  { label: '5M–10M',   min: 5_000_000,    max: 10_000_000 },
  { label: '10M–20M',  min: 10_000_000,   max: 20_000_000 },
  { label: '20M–50M',  min: 20_000_000,   max: 50_000_000 },
  { label: '50M+',     min: 50_000_000,   max: Infinity },
];

// Avoid overlap: first bin [min,max], others (min,max]
const inRange = (v: number, min: number, max: number, isFirst: boolean) =>
  isFirst ? v >= min && v <= max : v > min && v <= max;

const PremarketDollarTable: React.FC<Props> = ({
  premarketDollarData,
  timeHighBeforeLowIndexes,
  timeLowBeforeHighIndexes
}) => {
  const groupedData = RANGES.map((r, idx) => {
    let highBeforeLow = 0;
    let lowBeforeHigh = 0;

    for (const { idx: i, value: v } of premarketDollarData) {
      if (inRange(v, r.min, r.max, idx === 0)) {
        if (timeHighBeforeLowIndexes?.has(i)) highBeforeLow++;
        if (timeLowBeforeHighIndexes?.has(i)) lowBeforeHigh++;
      }
    }

    const total = highBeforeLow + lowBeforeHigh;

    return { key: idx, range: r.label, highBeforeLow, lowBeforeHigh, total };
  });

  const cols = [
    { title: 'Premarket $ Range', dataIndex: 'range', key: 'range' },
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
    <Card title="Premarket $ by Range (percent of row total)" style={{ width: '100%' }}>
      <Table columns={cols} dataSource={groupedData} pagination={false} rowKey="key" size="small" />
    </Card>
  );
};

export default PremarketDollarTable;
