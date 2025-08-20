import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import config from './config';
import EditCriteriaForm from './EditCriteriaForm';

interface CriteriaData {
  ID: number;
  Criteria: string;
  Description: string;
}

const CriteriaTable: React.FC = () => {
  const [data, setData] = useState<CriteriaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/criteria-data/get-criteria`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch criteria');
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

  const columns: ColumnsType<CriteriaData> = [
    {
      title: 'Criteria',
      dataIndex: 'Criteria',
      key: 'Criteria',
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      key: 'Description',
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
          Add Criteria
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
        <EditCriteriaForm recordId={editingId} onClose={closeModal} />
      </Modal>
    </>
  );
};

export default CriteriaTable;

