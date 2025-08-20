import React, { useMemo } from 'react';
import { Card, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

type Pair = { idx: number; value: number };

interface Props {
  title: string;
  volumeData: Pair[];
  timeHighBeforeLowIndexes?: Set<number>;
  timeLowBeforeHighIndexes?: Set<number>;
}

type Row = {
  key: number;
  range: string;
  highBeforeLow: number;
  lowBeforeHigh: number;
  total: number;
};

const VOL_RANGES = [
  { label: '0–2M',     min: 0,           max: 2_000_000 },
  { label: '2M–5M',    min: 2_000_000,   max: 5_000_000 },
  { label: '5M–10M',   min: 5_000_000,   max: 10_000_000 },
  { label: '10M–20M',  min: 10_000_000,  max: 20_000_000 },
  { label: '20M–50M',  min: 20_000_000,  max: 50_000_000 },
  { label: '50M–100M', min: 50_000_000,  max: 100_000_000 },
  { label: '100M+',    min: 100_000_000, max: Infinity },
] as const;

// Avoid overlap: first bin [min,max], others (min,max]
const inRange = (v: number, min: number, max: number, isFirst: boolean) =>
  isFirst ? v >= min && v <= max : v > min && v <= max;

const VolumeTable: React.FC<Props> = ({
  title,
  volumeData,
  timeHighBeforeLowIndexes,
  timeLowBeforeHighIndexes,
}) => {
  const groupedData: Row[] = useMemo(() => {
    return VOL_RANGES.map((r, idx) => {
      let highBeforeLow = 0;
      let lowBeforeHigh = 0;

      for (const { idx: i, value } of volumeData) {
        if (!Number.isFinite(value)) continue;
        if (inRange(value, r.min, r.max, idx === 0)) {
          if (timeHighBeforeLowIndexes?.has(i)) highBeforeLow++;
          if (timeLowBeforeHighIndexes?.has(i)) lowBeforeHigh++;
        }
      }

      const total = highBeforeLow + lowBeforeHigh;
      return { key: idx, range: r.label, highBeforeLow, lowBeforeHigh, total };
    });
  }, [volumeData, timeHighBeforeLowIndexes, timeLowBeforeHighIndexes]);

  const cols: ColumnsType<Row> = [
    { title: 'Volume Range', dataIndex: 'range', key: 'range' },
    {
      title: 'TimeHigh < TimeLow',
      dataIndex: 'highBeforeLow',
      key: 'highPct',
      align: 'right',
      render: (value: number, record) => {
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
      sorter: (a, b) => {
        const ta = a.total || 1, tb = b.total || 1;
        return a.highBeforeLow / ta - b.highBeforeLow / tb;
      },
    },
    {
      title: 'TimeLow < TimeHigh',
      dataIndex: 'lowBeforeHigh',
      key: 'lowPct',
      align: 'right',
      render: (value: number, record) => {
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
      sorter: (a, b) => {
        const ta = a.total || 1, tb = b.total || 1;
        return a.lowBeforeHigh / ta - b.lowBeforeHigh / tb;
      },
    },
  ];

  return (
    <Card title={`${title} (percent of row total)`} style={{ width: '100%' }}>
      <Table<Row>
        columns={cols}
        dataSource={groupedData}
        pagination={false}
        rowKey="key"
        size="small"
      />
    </Card>
  );
};

export default VolumeTable;

