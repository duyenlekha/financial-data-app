import React, { useState, useEffect } from 'react';
import { Table, message, Modal, InputNumber, Select, Button, Row, Col, Form, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import TradesForm from './TradesForm';
import EditTradesData from './EditTradesData';
import { ColumnsType } from 'antd/es/table';
import config from './config';

const { TextArea } = Input;
const { Option } = Select;

const TradesTable: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleEdit, setIsModalVisibleEdit] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filters, setFilters] = useState<any>({});
const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);


  const filterableFields = ['Shares', 'InAvg', 'OutAvg', 'PL', 'Percentage', 'NetGainLoss'];

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await axios.get(`${config.API_BASE_URL}/api/trades-data/get?${query}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch trade data');
      setLoading(false);
    }
  };

  const showModal = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setSelectedImageUrl(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedImageUrl(null);
  };

  const handleFilterChange = (field: string, comparison: string, value: number | null) => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      [field]: value,
      [`${field}_comparison`]: comparison,
    }));
  };

  const formatNumber = (num: number | null | undefined): string => {
    if (num === undefined || num === null || isNaN(num)) {
      return 'N/A';
    }
    return num.toFixed(2).toString();
  };

  const columns: ColumnsType = [
    { title: 'Symbol', dataIndex: 'Symbol', key: 'Symbol' },
    {
      title: 'Trade Date',
      dataIndex: 'TradeDate',
      key: 'TradeDate',
      sorter: (a, b) => dayjs(a.TradeDate).valueOf() - dayjs(b.TradeDate).valueOf(),
      render: (text) => (text ? dayjs(text).format('MM/DD/YYYY') : 'N/A'), // no .utc()
    },
    { title: 'Position', dataIndex: 'Position', key: 'Position' },
    { title: 'Shares', dataIndex: 'Shares', key: 'Shares', render: formatNumber },
    { title: 'P/L', dataIndex: 'PL', key: 'PL', render: formatNumber },
    { title: 'LocateFee', dataIndex: 'LocateFee', key: 'LocateFee', render: formatNumber },
    { title: 'Setup', dataIndex: 'Setup', key: 'Setup' },
    { title: 'Description', dataIndex: 'Description', key: 'Description' },
    {
      title: 'Image',
      dataIndex: 'ImageUrl',
      key: 'ImageUrl',
      render: (imageUrl: string) => (
        <Button onClick={() => showModal(imageUrl)} style={{ color: '#1890ff', textDecoration: 'underline' }}>
          View Image
        </Button>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type="primary" onClick={() => handleEdit(record.TradeID)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleEdit = (id: number) => {
    setEditingId(id);
    setIsModalVisibleEdit(true);
  };

  const closeEditModal = () => {
    setIsModalVisibleEdit(false);
    setEditingId(null);
    fetchData();
  };

  const openCreateModal = () => setIsCreateModalVisible(true);
  const closeCreateModal = () => setIsCreateModalVisible(false);

  return (
    <>
      <Row style={{ marginBottom: 12 }}>
        <Col>
          <Button type="primary" onClick={openCreateModal}>
            New Trade
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="TradeID"
        loading={loading}
        pagination={{ pageSizeOptions: ['10', '20', '50', '100'], defaultPageSize: 20, showSizeChanger: true }}
      />

      <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null} width={1000}>
        {selectedImageUrl && (() => {
          // normalize just in case DB stored 'images/foo.png' or 'C:\path\images\foo.png'
          const safeName = selectedImageUrl.split(/[/\\]/).pop()?.trim() || '';
          const imageSrc = `${config.API_BASE_URL}/api/trades-data/images/${encodeURIComponent(safeName)}`;

          console.log('Image src:', imageSrc);

          return (
            <img
              src={imageSrc}
              alt="Trade Screenshot"
              style={{ width: '100%' }}
              onError={(e) => {
                console.error('Failed to load image:', imageSrc);
                message.error('Image not found or blocked. Check filename and server logs.');
              }}
            />
          );
        })()}
      </Modal>

      <Modal visible={isModalVisibleEdit} onCancel={closeEditModal} footer={null} width={1000}>
        {editingId && <EditTradesData recordId={editingId} onClose={closeEditModal} />}
      </Modal>

      <Modal
        title="New Trade"
        visible={isCreateModalVisible}
        onCancel={closeCreateModal}
        footer={null}
        width={900}
        destroyOnClose
      >
        <TradesForm
          onSuccess={() => {
            closeCreateModal();
            fetchData(); // refresh table after creating a trade
          }}
        />
      </Modal>
    </>
  );
};

export default TradesTable;