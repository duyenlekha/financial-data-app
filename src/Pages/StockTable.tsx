import React, { useState, useEffect } from 'react';
import { Table, message, Modal, InputNumber, Select, Button, Row, Col, Form, Input, Upload} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile, UploadProps } from 'antd/es/upload/interface';
import axios from 'axios';
import dayjs from 'dayjs';
import EditStockDataForm from './EditStockDataForm';
import { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;


const StockTable: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleYearlyImage, setIsModalVisibleYearlyImage] = useState(false);
  const [isModalVisibleEdit, setIsModalVisibleEdit] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedImageUrlYearlyImage, setSelectedImageUrlYearlyImage] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [editingData, setEditingData] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null); // To store the ID of the record being edited


  
  

  

  
  const [filters, setFilters] = useState<any>({});
  const filterableFields = [
    'OpenPrice', 'HighPrice', 'ClosePrice', 'MarketCap', 'Float',
    'PreMarketVolume', 'OpenHourVolume', 'NeutralizeArea', 'DollarBlock',
    'Gap', 'EstimateVolumePercentage', 'PriceOpenPercentage', 'PL'
  ];

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      console.log(`Generated query: ${query}`);

      const response = await axios.get(`http://localhost:5003/api/financial-data/get?${query}`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch data');
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

  const showModalYearlyImage = (imageUrl: string) => {
    setSelectedImageUrlYearlyImage(imageUrl);
    setIsModalVisibleYearlyImage(true);
  };

  const handleOkYearlyImage = () => {
    setIsModalVisibleYearlyImage(false);
    setSelectedImageUrlYearlyImage(null);
  };

  const handleCancelYearlyImage = () => {
    setIsModalVisibleYearlyImage(false);
    setSelectedImageUrlYearlyImage(null);
  };


  const handleFilterChange = (field: string, comparison: string, value: number | null) => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      [field]: value,
      [`${field}_comparison`]: comparison,
    }));
  };

  const handleRangeChange = (field: string, minValue: number | null, maxValue: number | null) => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      [`min${field}`]: minValue,
      [`max${field}`]: maxValue,
    }));
  };


  const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1) + 'B';
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + 'M';
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + 'K';
    }
    return num.toString();
  };


  const handleDateFilter = (value: any, record: any) => {
    const recordDate = dayjs(record.Date); 
  
    const monthPattern = /^(0[1-9]|1[0-2])\/\d{4}$/;
    if (monthPattern.test(value)) {
      const [month, year] = value.split('/');
      return recordDate.month(month - 1).year(year).isSame(recordDate, 'month');
    }
  
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (datePattern.test(value)) {
      const [day, month, year] = value.split('/');
      return recordDate.date(day).month(month - 1).year(year).isSame(recordDate, 'day');
    }
  
    return true; 
  };
  


  

  

  const columns: ColumnsType = [
   
    
    { title: 'ShortType', dataIndex: 'ShortType', key: 'ShortType',
      filters: [
        { text: 'Multi Day Runner', value: 'Multi Day Runner' },
        { text: 'Gap Up Short', value: 'Gap Up Short' },
        { text: 'Bounce Short', value: 'Bounce Short' },
        { text: 'Double Intraday Top', value: 'Double Intraday Top' },
        { text: 'Momentum Shift', value: 'Momentum Shift' },
        { text: 'FRD', value: 'FRD' },
        { text: 'Overextended Gap Down', value: 'Overextended Gap Down' },
        { text: 'None', value: 'None' },
      ],
      onFilter: (value: any, record: any) => record.ShortType === value,
    },
    {
      title: 'Symbol',
      dataIndex: 'Symbol',
      key: 'Symbol',
      sorter: (a: any, b: any) => a.Symbol.localeCompare(b.Symbol), // Optional: Sorting by Symbol
      render: (text: any) => text, // Display the symbol as is
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search Symbol`}
            value={selectedKeys[0]} // Bind selected value to input
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])} // Handle input change
            onPressEnter={() => confirm()} // Press enter to confirm search
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <div>
            <a onClick={() => clearFilters()}>Reset</a>
            <a
              onClick={() => confirm()} // Apply search
              style={{ marginLeft: 8 }}
            >
              Search
            </a>
          </div>
        </div>
      ),
      onFilter: (value: any, record: any) => {
        // Ensuring value is a string
        const filterValue = value.toLowerCase();
        return record.Symbol.toLowerCase().includes(filterValue); // Compare input value with Symbol
      },
    },
    {
      title: 'Date',
      dataIndex: 'Date',
      key: 'Date',
      sorter: (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime(),
      sortDirections: ['ascend', 'descend'],
      render: (text) => (text ? dayjs.utc(text).format('MM/DD/YYYY') : 'N/A'),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            placeholder="Search by Month or Date (MM/YYYY or MM/DD/YYYY)"
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            onClick={() => confirm()}
            type="primary"
            style={{ marginRight: 8 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && clearFilters()}
            type="default"
          >
            Reset
          </Button>
        </div>
      ),
      onFilter: handleDateFilter,
    },
    {
      title: 'Gap',
      dataIndex: 'Gap',
      key: 'Gap',
      render: (value: number) => `${formatNumber(value)}%`,
    },
    {
      title: 'Market Cap',
      dataIndex: 'MarketCap',
      key: 'MarketCap',
      render: (value: number) => formatNumber(value),
    },
    {
      title: 'Float',
      dataIndex: 'Float',
      key: 'Float',
      render: (value: number) => formatNumber(value),
    },
    {
      title: 'Pre-Market Volume',
      dataIndex: 'PreMarketVolume',
      key: 'PreMarketVolume',
      render: (value: number) => formatNumber(value),
    },
    {
      title: 'Estimate Volume %',
      dataIndex: 'EstimateVolumePercentage',
      key: 'EstimateVolumePercentage',
      render: (value: number) => `${formatNumber(value)}%`,
    },
    {
      title: 'Open Price',
      dataIndex: 'OpenPrice',
      key: 'OpenPrice',
      render: (value: number) => `$${formatNumber(value)}`,
    },
    {
      title: 'Price Open %',
      dataIndex: 'PriceOpenPercentage',
      key: 'PriceOpenPercentage',
      render: (value: number) => `${formatNumber(value)}%`,
    },
    {
      title: 'Neutralize Area',
      dataIndex: 'NeutralizeArea',
      key: 'NeutralizeArea',
      render: (value: number) => `$${formatNumber(value)}`,
    },
    
    { title: 'Description', dataIndex: 'Description', key: 'Description' },
    {
      title: 'Dollar Block',
      dataIndex: 'DollarBlock',
      key: 'DollarBlock',
      render: (value: number) => `$${formatNumber(value)}`,
    },
    {
      title: 'PL',
      dataIndex: 'PL',
      key: 'PL',
      render: (value: number) => `$${formatNumber(value)}`,
    },
    
   
    {
      title: 'Image',
      dataIndex: 'ImageUrl',
      key: 'ImageUrl',
      render: (imageUrl: string) => (
        <Button
          onClick={() => showModal(imageUrl)}
          style={{
            background: 'none',
            border: 'none',
            color: '#1890ff',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          View Image
        </Button>
      ),
    },
    {
      title: 'Short',
      dataIndex: 'Short',
      key: 'Short',
      render: (value: boolean) => (value ? '✔️' : '❌'),
      filters: [
        { text: 'True', value: 1 },
        { text: 'False', value: 0 }
      ],
      onFilter: (value: any, record: any) => record.Short === value,
    },
    

    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type="primary" onClick={() => handleEdit(record.Id)}>
          Edit
        </Button>
      ),
    },
    
  ];

  const handleEdit = (id: number) => {
    setEditingId(id); // Set the ID of the record being edited
    setIsModalVisibleEdit(true); // Open the modal
  };

  const closeEditModal = () => {
    setIsModalVisibleEdit(false); // Close the modal
    setEditingId(null); // Reset the editing ID
    fetchData(); // Refresh data after editing
  };

  const rowClassName = (record: { PL: number }) => {
    if (record.PL > 0) return 'row-positive';
    if (record.PL < 0) return 'row-negative';
    return 'row-neutral'; // For 0 or other cases
  };

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {filterableFields.map((field) => (
          <Col key={field} span={8} style={{ marginBottom: 16 }}>
            <Select
              defaultValue="gt"
              style={{ width: 120 }}
              onChange={(value) => handleFilterChange(field, value, filters[field] || null)}
            >
              <Option value="gt">Greater Than</Option>
              <Option value="lt">Less Than</Option>
              <Option value="eq">Equal To</Option>
            </Select>
            <InputNumber
              placeholder={field}
              style={{ width: 200, marginLeft: 8 }}
              onChange={(value: number | null) => handleFilterChange(field, filters[`${field}_comparison`] || 'gt', value)}
            />
            <InputNumber
              placeholder={`Min ${field}`}
              style={{ width: 100, marginLeft: 8 }}
              onChange={(value: number | null) => handleRangeChange(field, value, filters[`max${field}`] || null)}
            />
            <InputNumber
              placeholder={`Max ${field}`}
              style={{ width: 100, marginLeft: 8 }}
              onChange={(value: number | null) => handleRangeChange(field, filters[`min${field}`] || null, value)}
            />
          </Col>
        ))}
        <Col span={24}>
          <Button type="primary" onClick={fetchData} style={{ marginTop: 16 }}>
            Apply Filter
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns.map((col) => ({
          ...col,
          onCell: () => ({
            style: { fontSize: '12px' }, 
          }),
        }))}
        dataSource={data}
        rowKey="Id"
        loading={loading}
        rowClassName={rowClassName}
        pagination={{
          pageSizeOptions: ['10', '20', '50', '100'],
          defaultPageSize: 20,
          showSizeChanger: true,
        }}
        style={{ fontSize: '12px' }} 
      />

      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={2000}
      >
        {selectedImageUrl && (
          <img
            src={`http://localhost:5003/images/${encodeURIComponent(selectedImageUrl)}`}
            alt="Detailed View"
            style={{ width: '100%' }}
          />
        )}
      </Modal>

      

      <Modal
        visible={isModalVisibleEdit}
        onCancel={closeEditModal}
        footer={null}
        width={1700}
      >
        {editingId && (
          <EditStockDataForm
            recordId={editingId} // Pass the ID to the EditStockDataForm component
            onClose={closeEditModal} // Pass a function to close the modal
          />
        )}
      </Modal>


      

      

      
    </>
  );
};

export default StockTable;
