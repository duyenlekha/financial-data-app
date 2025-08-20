import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Space, Input } from 'antd';
import { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import config from './config';
import EditNoteForm from './EditeNoteForm';


interface NoteData {
  ID: number;
  Note: string;
}

const NoteTable: React.FC = () => {
  const [data, setData] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);



  

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/note-data/get-note`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch notes');
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

  const columns: ColumnsType<NoteData> = [
    {
        title: 'Note',
        dataIndex: 'Note',
        key: 'Note',
        // Enable searching like you did with Symbol
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder="Search Note"
              value={selectedKeys[0]}
              onChange={(e: any) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => confirm()}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <div>
              <a onClick={() => clearFilters()}>Reset</a>
              <a onClick={() => confirm()} style={{ marginLeft: 8 }}>
                Search
              </a>
            </div>
          </div>
        ),
        onFilter: (value: any, record: any) => {
          const filterValue = value.toLowerCase();
          return record.Note?.toLowerCase().includes(filterValue);
        },
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
          Add Note
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
        <EditNoteForm recordId={editingId} onClose={closeModal} />
      </Modal>
    </>
  );
};

export default NoteTable;
