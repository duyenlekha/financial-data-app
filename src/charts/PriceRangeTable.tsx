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
  { label: '1–3',     min: 1,    max: 3 },
  { label: '3–5',     min: 3,    max: 5 },
  { label: '5–7',     min: 5,    max: 7 },
  { label: '7–10',    min: 7,    max: 10 },
  { label: '10–15',   min: 10,   max: 15 },
  { label: '15–20',   min: 15,   max: 20 },
  { label: '20–30',   min: 20,   max: 30 },
  { label: '30–50',   min: 30,   max: 50 },
  { label: '50–75',   min: 50,   max: 75 },
  { label: '75–100',  min: 75,   max: 100 },
  { label: '100–150', min: 100,  max: 150 },
  { label: '150–200', min: 150, max: 200 },
{ label: '200–250', min: 200, max: 250 },
{ label: '250–300', min: 250, max: 300 },
{ label: '300–350', min: 300, max: 350 },
{ label: '350–400', min: 350, max: 400 },
{ label: '400+',    min: 400, max: Infinity },
];

// Avoid overlap: first bin [min,max], others (min,max]
const inRange = (v: number, min: number, max: number, isFirst: boolean) =>
  isFirst ? v >= min && v <= max : v > min && v <= max;

const PriceRangeTable: React.FC<Props> = ({
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

export default PriceRangeTable;
