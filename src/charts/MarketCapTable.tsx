import React from 'react';
import { Card, Table } from 'antd';

type Pair = { idx: number; value: number };

interface Props {
  marketCapData: Pair[]; // [{ idx, value }]
  timeHighBeforeLowIndexes?: Set<number>;
  timeLowBeforeHighIndexes?: Set<number>;
}

const MCAP = [
  { label: '0–5M',        min: 0,             max: 5_000_000 },
  { label: '5–10M',       min: 5_000_000,     max: 10_000_000 },
  { label: '10–20M',      min: 10_000_000,    max: 20_000_000 },
  { label: '20–40M',      min: 20_000_000,    max: 40_000_000 },
  { label: '40–50M',      min: 40_000_000,    max: 50_000_000 },
  { label: '50–75M',      min: 50_000_000,    max: 75_000_000 },
  { label: '75–100M',     min: 75_000_000,    max: 100_000_000 },
  { label: '100–150M',    min: 100_000_000,   max: 150_000_000 },
  { label: '150–200M',    min: 150_000_000,   max: 200_000_000 },
  { label: '200–300M',    min: 200_000_000,   max: 300_000_000 },
  { label: '300–500M',    min: 300_000_000,   max: 500_000_000 },
  { label: '500–750M',    min: 500_000_000,   max: 750_000_000 },
  { label: '750M–1B',     min: 750_000_000,   max: 1_000_000_000 },
  { label: '1B–3B',       min: 1_000_000_000, max: 3_000_000_000 },
  { label: '3B+',         min: 3_000_000_000, max: Infinity },
];


const inRange = (v: number, min: number, max: number, isFirst: boolean) =>
  isFirst ? v >= min && v <= max : v > min && v <= max;

const MarketCapTable: React.FC<Props> = ({
  marketCapData,
  timeHighBeforeLowIndexes,
  timeLowBeforeHighIndexes
}) => {
  const groupedData = MCAP.map((r, idx) => {
    let highBeforeLow = 0;
    let lowBeforeHigh = 0;

    for (const { idx: dataIdx, value } of marketCapData) {
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
    { title: 'Market Cap', dataIndex: 'range', key: 'range' },
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
    <Card title="Market Cap by Range (percent of row total)" style={{ width: '100%' }}>
      <Table columns={cols} dataSource={groupedData} pagination={false} rowKey="key" size="small" />
    </Card>
  );
};

export default MarketCapTable;
