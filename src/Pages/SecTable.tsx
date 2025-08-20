import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import dayjs from 'dayjs';
import config from './config';
import EditSecForm from './EditSecForm';

interface SecData {
  ID: number;
  Symbol: string;
  Description: string;
  DateSubmitted: string;
}

const SecTable: React.FC = () => {
  const [data, setData] = useState<SecData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/sec-data/get-sec`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch SEC data');
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
    setEditingId(null); // null means new record
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingId(null);
    fetchData();
  };

  const columns: ColumnsType<SecData> = [
    {
      title: 'Symbol',
      dataIndex: 'Symbol',
      key: 'Symbol',
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
      title: 'Date Submitted',
      dataIndex: 'DateSubmitted',
      key: 'DateSubmitted',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
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
          Add SEC Record
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="ID"
        loading={loading}
        pagination={{ pageSize: 20 }}
      />

      <Modal
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={600}
        destroyOnClose
      >
        <EditSecForm recordId={editingId} onClose={closeModal} />
      </Modal>
    </>
  );
};

export default SecTable;
