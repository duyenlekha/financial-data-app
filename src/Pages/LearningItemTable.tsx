import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Space, Input } from 'antd';
import { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import config from './config';
import EditLearningItemForm from './EditLearningItemForm';

interface LearningItemData {
  ID: number;
  ThingToLearn: string;
  Summary: string;
  Source: string;
}

const LearningItemTable: React.FC = () => {
  const [data, setData] = useState<LearningItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/learning-items/get-learning-items`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch learning items');
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
    setEditingId(null);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingId(null);
    fetchData();
  };

  const columns: ColumnsType<LearningItemData> = [
    {
      title: 'Thing To Learn',
      dataIndex: 'ThingToLearn',
      key: 'ThingToLearn',
    },
    {
      title: 'Summary',
      dataIndex: 'Summary',
      key: 'Summary',
    },
    {
      title: 'Source',
      dataIndex: 'Source',
      key: 'Source',
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
          Add Learning Item
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
        <EditLearningItemForm recordId={editingId} onClose={closeModal} />
      </Modal>
    </>
  );
};

export default LearningItemTable;
