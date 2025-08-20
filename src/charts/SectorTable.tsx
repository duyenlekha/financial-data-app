import React from 'react';
import { Card, Table } from 'antd';

interface Props {
  sectorData: string[];
}

const SECTOR_LABELS = [
  'Consumer Discretionary',
  'Consumer Staples',
  'Consumer Defensive',
  'Consumer Cyclical',
  'Communication Services',
  'Media',
  'Real Estate',
  'Healthcare',
  'Financial Services',
  'Finance',
  'Energy',
  'Utilities',
  'Technology',
  'Industrials',
  'Basic Materials',
  'N/A',
];

const SectorTable: React.FC<Props> = ({ sectorData }) => {
  const groupedData = SECTOR_LABELS.map((label, index) => {
    const count = sectorData.filter(
      (sector) => sector?.toLowerCase() === label.toLowerCase()
    ).length;

    return {
      key: index,
      sector: label,
      count,
    };
  });

  const columns = [
    {
      title: 'Sector',
      dataIndex: 'sector',
      key: 'sector',
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  return (
    <Card title="Sector Count" style={{ width: '100%' }}>
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

export default SectorTable;
