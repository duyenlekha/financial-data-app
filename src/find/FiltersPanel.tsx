






import React from 'react';
import { Row, Col, Select, InputNumber, Button, Space, Typography } from 'antd';
import { filterGroups7 } from './utils'; // ← 7 groups

const { Option } = Select;

type Props = {
  filters: any;
  setFilters: (updater: any) => void;
  onApply: () => void;
};

const FiltersPanel: React.FC<Props> = ({ filters, setFilters, onApply }) => {
  const handleFilterChange = (field: string, comparison: string, value: number | null) => {
    setFilters((prev: any) => ({ ...prev, [field]: value, [`${field}_comparison`]: comparison }));
  };

  const handleRangeChange = (field: string, minValue: number | null, maxValue: number | null) => {
    setFilters((prev: any) => {
      const next: any = { ...prev };
      if (minValue != null) next[`min${field}`] = minValue; else delete next[`min${field}`];
      if (maxValue != null) next[`max${field}`] = maxValue; else delete next[`max${field}`];
      return next;
    });
  };

  const toNumber = (v: number | string | null): number | null => {
    if (v === null || v === undefined || v === '') return null;
    return typeof v === 'number' ? v : (isNaN(Number(v)) ? null : Number(v));
  };

  const renderField = (field: string) => (
    <div key={field} style={{ display: 'flex', gap: 8, width: '100%' }}>
      <Select
        style={{ width: 120 }}
        value={(filters as any)[`${field}_comparison`] || 'gt'}
        onChange={(val) => handleFilterChange(field, val, (filters as any)[field] ?? null)}
        options={[
          { value: 'gt', label: 'Greater Than' },
          { value: 'lt', label: 'Less Than' },
          { value: 'eq', label: 'Equal To' },
        ]}
      />
      <InputNumber
  placeholder={field}
  style={{ width: 200 }}
  onChange={(v) =>
    handleFilterChange(
      field,
      (filters as any)[`${field}_comparison`] || 'gt',
      toNumber(v as number | string | null)
    )
  }
/>

<InputNumber
  placeholder={`Min ${field}`}
  style={{ width: 110 }}
  onChange={(v) =>
    handleRangeChange(
      field,
      toNumber(v as number | string | null),
      (filters as any)[`max${field}`] ?? null
    )
  }
/>

<InputNumber
  placeholder={`Max ${field}`}
  style={{ width: 110 }}
  onChange={(v) =>
    handleRangeChange(
      field,
      (filters as any)[`min${field}`] ?? null,
      toNumber(v as number | string | null)
    )
  }
/>
    </div>
  );

  return (
    <>
      {/* Horizontal scroll so 7 columns don't squish */}
      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <Row gutter={[24, 0]} wrap={false} align="top">
          {filterGroups7.map((group) => (
            <Col key={group.title} flex="0 0 420px" style={{ minWidth: 680 }}>
              <Typography.Title level={5} style={{ marginTop: 0 }}>{group.title}</Typography.Title>
              <Space direction="vertical" size={10} style={{ width: '100%', maxHeight: '70vh', overflowY: 'auto' }}>
                {group.fields.map(renderField)}

                {/* Put booleans wherever you like—here under Misc */}
                {group.title === 'Misc' && (
                  <>
                    <Select
                      placeholder="BrokePMHigh"
                      allowClear
                      style={{ width: 200 }}
                      value={(filters as any).BrokePremarketHigh || undefined}
                      onChange={(value: string | null) => {
                        setFilters((prev: any) => {
                          const u = { ...prev };
                          if (value) u.BrokePremarketHigh = value.toUpperCase(); else delete u.BrokePremarketHigh;
                          return u;
                        });
                      }}
                      options={[{ value: 'TRUE', label: 'TRUE' }, { value: 'FALSE', label: 'FALSE' }]}
                    />
                    <Select
                      placeholder="ClosedRed"
                      allowClear
                      style={{ width: 200 }}
                      value={(filters as any).ClosedRed || undefined}
                      onChange={(value: string | null) => {
                        setFilters((prev: any) => {
                          const u = { ...prev };
                          if (value) u.ClosedRed = value.toUpperCase(); else delete u.ClosedRed;
                          return u;
                        });
                      }}
                      options={[{ value: 'TRUE', label: 'TRUE' }, { value: 'FALSE', label: 'FALSE' }]}
                    />
                  </>
                )}
              </Space>
            </Col>
          ))}
        </Row>
      </div>

      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Button type="primary" onClick={onApply}>Apply Filters</Button>
        </Col>
      </Row>
    </>
  );
};

export default FiltersPanel;
