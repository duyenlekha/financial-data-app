


import React from 'react';
import { Row, Col, Select, InputNumber, Input, Button } from 'antd';
import { Comparison } from './types';
import { filterableFields } from './utils';

const { Option } = Select;

type Props = {
  comparisons: Comparison[];
  setComparisons: React.Dispatch<React.SetStateAction<Comparison[]>>;
  onApply: () => void;
};

const ComparisonBuilder: React.FC<Props> = ({ comparisons, setComparisons, onApply }) => {
  const addComparison = () => {
    setComparisons((prev) => [
      ...prev,
      { id: Date.now(), fieldA: '', operator: '>', fieldB: '', useValue: false, value: null },
    ]);
  };

  const removeComparison = (id: number) => setComparisons((prev) => prev.filter((c) => c.id !== id));

  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      {comparisons.map((comp, index) => (
        <Row key={comp.id} gutter={8} style={{ marginBottom: 8 }}>
          <Col>
            <Select
              placeholder="Field A"
              value={comp.fieldA}
              style={{ width: 150 }}
              onChange={(val) => {
                const updated = [...comparisons];
                updated[index].fieldA = val;
                setComparisons(updated);
              }}
            >
              {filterableFields.map((f) => <Option key={f} value={f}>{f}</Option>)}
            </Select>
          </Col>
          <Col>
            <Select
              value={comp.operator}
              style={{ width: 80 }}
              onChange={(val) => {
                const updated = [...comparisons];
                updated[index].operator = val as any;
                setComparisons(updated);
              }}
            >
              <Option value=">">{'>'}</Option>
              <Option value="<">{'<'}</Option>
              <Option value="=">{'='}</Option>
            </Select>
          </Col>
          <Col>
            {comp.useValue ? (
              comp.fieldA.toLowerCase().includes('time') ? (
                <Input
                  value={(comp.value as string) ?? ''}
                  placeholder="HH:mm"
                  style={{ width: 150 }}
                  onChange={(e) => {
                    const updated = [...comparisons];
                    updated[index].value = e.target.value;
                    setComparisons(updated);
                  }}
                />
              ) : (
                <InputNumber
                  value={(comp.value as number) ?? undefined}
                  placeholder="Value"
                  style={{ width: 150 }}
                  onChange={(val) => {
                    const updated = [...comparisons];
                    updated[index].value = (val ?? null) as any;
                    setComparisons(updated);
                  }}
                />
              )
            ) : (
              <Select
                placeholder="Field B"
                value={comp.fieldB}
                style={{ width: 150 }}
                onChange={(val) => {
                  const updated = [...comparisons];
                  updated[index].fieldB = val;
                  setComparisons(updated);
                }}
              >
                {filterableFields.map((f) => <Option key={f} value={f}>{f}</Option>)}
              </Select>
            )}
          </Col>
          <Col>
            <Button type="link" onClick={() => {
              const updated = [...comparisons];
              updated[index].useValue = !updated[index].useValue;
              setComparisons(updated);
            }}>
              {comp.useValue ? 'Use Field' : 'Use Value'}
            </Button>
          </Col>
          <Col>
            <Button danger onClick={() => removeComparison(comp.id)}>Remove</Button>
          </Col>
        </Row>
      ))}
      <Col span={24}>
        <Button onClick={addComparison} type="dashed" style={{ marginTop: 8 }}>Add Comparison</Button>
        <Button type="primary" onClick={onApply} style={{ marginLeft: 8 }}>Apply</Button>
      </Col>
    </Row>
  );
};

export default ComparisonBuilder;
