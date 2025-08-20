import React from 'react';
import { Card, Table } from 'antd';

type Pair = { idx: number; value: number };

interface Props {
  title: string;
  data: Pair[];
  timeHighBeforeLowIndexes?: Set<number>;
  timeLowBeforeHighIndexes?: Set<number>;
}

const GAP_RANGES = [
  { label: '-50%–0%',   min: -50,      max: 0 },
  { label: '0%–5%',     min: 0,        max: 5 },
  { label: '5%–10%',    min: 5,        max: 10 },
  { label: '10%–20%',   min: 10,       max: 20 },
  { label: '20%–30%',   min: 20,       max: 30 },
  { label: '30%–50%',   min: 30,       max: 50 },
  { label: '50%–100%',  min: 50,       max: 100 },
  { label: '100%–200%', min: 100,      max: 200 },
  { label: '200%+',     min: 200,      max: Infinity },
];

// Avoid overlap: first bin [min, max], others (min, max]
const inRange = (v: number, min: number, max: number, isFirst: boolean) =>
  isFirst ? v >= min && v <= max : v > min && v <= max;

const GapPercentTable: React.FC<Props> = ({
  title,
  data: gapPercentData,
  timeHighBeforeLowIndexes,
  timeLowBeforeHighIndexes
}) => {
  const groupedData = GAP_RANGES.map((range, index) => {
    let highBeforeLow = 0;
    let lowBeforeHigh = 0;

    for (const { value, idx } of gapPercentData) {
      if (inRange(value, range.min, range.max, index === 0)) {
        if (timeHighBeforeLowIndexes?.has(idx)) highBeforeLow++;
        if (timeLowBeforeHighIndexes?.has(idx)) lowBeforeHigh++;
      }
    }

    const total = highBeforeLow + lowBeforeHigh;

    return { key: index, range: range.label, highBeforeLow, lowBeforeHigh, total };
  });

  const columns = [
    { title: 'Gap % Range', dataIndex: 'range', key: 'range' },
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

export default GapPercentTable;
