import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import config from './config';
import EditRulesForm from './EditRulesForm';

interface RuleData {
  ID: number;
  Rules: string;
}

const RulesTable: React.FC = () => {
  const [data, setData] = useState<RuleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/rules-data/get-rules`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch rules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id: number) => {
    setEditingId(id);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingId(null); // null = add mode
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingId(null);
    fetchData();
  };

  const columns: ColumnsType<RuleData> = [
    {
      title: 'Rule',
      dataIndex: 'Rules',
      key: 'Rules',
      render: (text: string) => {
        if (!text) return null;
        const formatted = text.replace(/(?<!\d)\.(?!\d)/g, '.<br/>');
        return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleEdit(record.ID)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          Add Rule
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="ID"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={600}
        destroyOnClose
      >
        <EditRulesForm recordId={editingId} onClose={closeModal} />
      </Modal>
    </>
  );
};

export default RulesTable;
