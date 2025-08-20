import React from 'react';
import { Card, Table } from 'antd';

type Pair = { idx: number; value: number };

interface Props {
  floatData: Pair[];
  timeHighBeforeLowIndexes?: Set<number>;
  timeLowBeforeHighIndexes?: Set<number>;
}

const FLOAT_RANGES = [
  { label: '0–1M', min: 0, max: 1_000_000 },
  { label: '1–3M', min: 1_000_000, max: 3_000_000 },
  { label: '3–5M', min: 3_000_000, max: 5_000_000 },
  { label: '5M–10M', min: 5_000_001, max: 10_000_000 },
  { label: '10M–20M', min: 10_000_001, max: 20_000_000 },
  { label: '20M–50M', min: 20_000_001, max: 50_000_000 },
  { label: '50M–100M', min: 50_000_001, max: 100_000_000 },
  { label: '100M–200M', min: 100_000_001, max: 200_000_000 },
  { label: '200M+', min: 200_000_001, max: Infinity },
];


const inRange = (v: number, min: number, max: number, isFirst: boolean) =>
  isFirst ? v >= min && v <= max : v > min && v <= max;


const FloatTable: React.FC<Props> = ({
  floatData,
  timeHighBeforeLowIndexes,
  timeLowBeforeHighIndexes
}) => {
  const groupedData = FLOAT_RANGES.map((r, idx) => {
    let highBeforeLow = 0;
    let lowBeforeHigh = 0;

    for (const { idx: dataIdx, value } of floatData) {
      if (inRange(value, r.min, r.max, idx === 0)) {
        if (timeHighBeforeLowIndexes?.has(dataIdx)) highBeforeLow++;
        if (timeLowBeforeHighIndexes?.has(dataIdx)) lowBeforeHigh++;
      }
    }

    const total = highBeforeLow + lowBeforeHigh;

    return {
      key: idx,
      range: r.label,
      highBeforeLow,
      lowBeforeHigh,
      total,
    };
  });

  const cols = [
    { title: 'Float Range', dataIndex: 'range', key: 'range' },
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
    <Card title="Float by Range (percent of row total)" style={{ width: '100%' }}>
      <Table columns={cols} dataSource={groupedData} pagination={false} rowKey="key" size="small" />
    </Card>
  );
};

export default FloatTable;