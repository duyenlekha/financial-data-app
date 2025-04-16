import React, { useState, useEffect } from 'react';
import { Table, message, Modal, InputNumber, Select, Button, Row, Col, Form, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import EditTradesData from './EditTradesData';
import { ColumnsType } from 'antd/es/table';

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

  const filterableFields = ['Shares', 'InAvg', 'OutAvg', 'PL', 'Percentage', 'NetGainLoss'];

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await axios.get(`http://localhost:5003/api/trades-data/get?${query}`);
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
    { title: 'Exchange', dataIndex: 'Exchange', key: 'Exchange' },
    { title: 'Sector', dataIndex: 'Sector', key: 'Sector' },
    {
      title: 'Trade Date',
      dataIndex: 'TradeDate',
      key: 'TradeDate',
      sorter: (a, b) => new Date(a.TradeDate).getTime() - new Date(b.TradeDate).getTime(),
      render: (text) => (text ? dayjs.utc(text).format('MM/DD/YYYY') : 'N/A'),
    },
    { title: 'Position', dataIndex: 'Position', key: 'Position' },
    { title: 'Shares', dataIndex: 'Shares', key: 'Shares', render: formatNumber },
    { title: 'In Avg', dataIndex: 'InAvg', key: 'InAvg', render: formatNumber },
    { title: 'Out Avg', dataIndex: 'OutAvg', key: 'OutAvg', render: formatNumber },
    { title: 'P/L', dataIndex: 'PL', key: 'PL', render: formatNumber },
    { title: 'LocateFee', dataIndex: 'LocateFee', key: 'LocateFee', render: formatNumber },
    { title: 'Percentage', dataIndex: 'Percentage', key: 'Percentage', render: formatNumber },
    { title: 'Net Gain/Loss', dataIndex: 'NetGainLoss', key: 'NetGainLoss', render: formatNumber },
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

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="TradeID"
        loading={loading}
        pagination={{ pageSizeOptions: ['10', '20', '50', '100'], defaultPageSize: 20, showSizeChanger: true }}
      />

      <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null} width={800}>
        {selectedImageUrl && <img src={`http://localhost:5003/images/${encodeURIComponent(selectedImageUrl)}`} alt="Trade Screenshot" style={{ width: '100%' }} />}
      </Modal>

      <Modal visible={isModalVisibleEdit} onCancel={closeEditModal} footer={null} width={1000}>
        {editingId && <EditTradesData recordId={editingId} onClose={closeEditModal} />}
      </Modal>
    </>
  );
};

export default TradesTable;