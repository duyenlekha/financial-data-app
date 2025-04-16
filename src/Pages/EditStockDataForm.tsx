import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Spin, DatePicker, Upload, Select, Row, Col, InputNumber, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { UploadFile, UploadProps } from 'antd/es/upload/interface';
const { Option } = Select;
const { TextArea } = Input;

interface StockData {
    Id: number;
    ShortType: string;
    Symbol: string;
    Date: string;
    MarketCap: number;
    Float: number;
    PreMarketVolume: number;
    OpenHourVolume: number;
    OpenPrice: number;
    HighPrice: number;
    NeutralizeArea: number;
    DollarBlock: number;
    Description: string;
    Gap: number;
    EstimateVolumePercentage: number;
    PriceOpenPercentage: number;
    PL: number;
    Short: number;
    ImageUrl: string;
  }

interface EditStockDataFormProps {
    recordId: number; 
    onClose: () => void; 
  }

const calculateEstimateVolumePercentage = (openHourVolume: number, preMarketVolume: number) => {
  if (!openHourVolume || !preMarketVolume) return 0;
  return (openHourVolume / preMarketVolume) * 100;
};

const calculatePriceOpenPercentage = (openPrice: number, highPrice: number) => {
  if (!openPrice || !highPrice) return 0;
  return ((highPrice - openPrice) / openPrice) * 100;
};

const EditStockDataForm: React.FC<EditStockDataFormProps> = ({ recordId, onClose }) => {

  
  const [data, setData] = useState<StockData[]>([]);
  const navigate = useNavigate();

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5003/api/financial-data/get/${recordId}`);
        const fetchedData: StockData[] = response.data;
        setData(fetchedData);
        
      
        if (fetchedData.length > 0) {
          const record = fetchedData[0]; 
          form.setFieldsValue({
            ...record,
            Date: record.Date ? moment(record.Date) : null, 
          });
          setFileList(
            record.ImageUrl
              ? [
                  {
                    uid: '-1',
                    name: record.ImageUrl,
                    status: 'done',
                    url: record.ImageUrl,
                  },
                ]
              : []
          );
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error('Failed to fetch record data');
      }
    };

    if (recordId) {
      fetchData();
    }
  }, [recordId, form]);

  console.log("ff", data)











  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    fileList,
    onChange: ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
      setFileList(newFileList);
      if (newFileList.length > 0) {
        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result as string);
        reader.readAsDataURL(newFileList[0].originFileObj as File);
      } else {
        setPreviewImage('');
      }
    },
    maxCount: 1,
  };


  const calculateEstimateVolumePercentage = (openHourVolume: number, preMarketVolume: number) => {
    return (openHourVolume * 100) / (preMarketVolume * 10);
  };

  const calculatePriceOpenPercentage = (openPrice: number, highPrice: number) => {
    return (highPrice / openPrice) * 100;
  };



  const handleUpdate = async (values: any) => {
    setLoading(true);
    const shortValue = values.Short ? 1 : 0;

    const payload: Record<string, any> = {
        ShortType: values.ShortType || '',
        Symbol: values.Symbol || '',
        Date: values.Date ? values.Date.format('YYYY-MM-DD') : null,
        MarketCap: values.MarketCap || 0,
        Float: values.Float || 0,
        Gap: values.Gap || 0,
        PreMarketVolume: values.PreMarketVolume || 0,
        OpenHourVolume: values.OpenHourVolume || 0,
        OpenPrice: values.OpenPrice || 0,
        HighPrice: values.HighPrice || 0,
        NeutralizeArea: values.NeutralizeArea || 0,
        DollarBlock: values.DollarBlock || 0,
        Description: values.Description || '',
        PL: values.PL || 0,
        ImageUrl: values.ImageUrl || '',
        Short: shortValue,
    };

    if (!payload.Date) {
      message.error('Please select a date');
      setLoading(false);
      return;
    }

    if (fileList.length > 0 && fileList[0].originFileObj) {
      const file = fileList[0].originFileObj;
      payload.ImageUrl = file.name;
    } else {
        payload.ImageUrl = data[0].ImageUrl
    }

    
    
    payload.EstimateVolumePercentage = calculateEstimateVolumePercentage(
      payload.OpenHourVolume,
      payload.PreMarketVolume
    );
    payload.PriceOpenPercentage = calculatePriceOpenPercentage(payload.OpenPrice, payload.HighPrice);

    console.log("tt", payload)

    try {

        
        await axios.put(`http://localhost:5003/api/financial-data/update/${recordId}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        form.resetFields();
        setFileList([]);
        message.success('Stock data updated successfully');
        setLoading(false);
        navigate('/');
      } catch (error) {
        setLoading(false);
        message.error('Failed to update stock data');
      } finally {
        setLoading(false);
      }

    
  };



  return (
    <Spin spinning={loading}>
      <Form form={form} layout="vertical" onFinish={handleUpdate}>

      

    <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="ShortType" label="Short Type" rules={[{ required: true, message: 'Please select a Short Type!' }]}>
                <Select placeholder="Select a Short Type">
                  <Option value="Multi Day Runner">Multi Day Runner</Option>
                  <Option value="Gap Up Short">Gap Up Short</Option>
                  <Option value="Bounce Short">Bounce Short</Option>
                  <Option value="Double Intraday Top">Double Intraday Top</Option>
                  <Option value="Momentum Shift">Momentum Shift</Option>
                  <Option value="FRD">FRD</Option>
                  <Option value="Overextended Gap Down">Overextended Gap Down</Option>
                  <Option value="None">None</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="Symbol" label="Symbol" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="Date" label="Date" rules={[{ required: true }]}>
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="MarketCap" label="Market Cap">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="Float" label="Float">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="PreMarketVolume" label="Pre-Market Volume">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
            <Form.Item name="OpenHourVolume" label="Open Hour Volume">
      <InputNumber
        style={{ width: '100%' }}
        min={0}
        max={9999999999} 
      />
    </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="Gap" label="Gap">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="OpenPrice" label="Open Price">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="HighPrice" label="High Price">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="NeutralizeArea" label="Neutralize Area">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="DollarBlock" label="Dollar Block">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="Description" label="Description">
                <TextArea rows={4} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="PL" label="PL">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
            <Form.Item
            name="Short"
            label="Short"
            valuePropName="checked"
            initialValue={data[0]?.Short === 1} 
          >
            <Checkbox />
          </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
                {data && data[0] && data[0].ImageUrl ? (
                <img
                    src={`http://localhost:5003/images/${encodeURIComponent(data[0].ImageUrl)}`}
                    alt="Detailed View"
                    style={{ width: '100%', height: 'auto', maxHeight: '500px' }}
                />
                ) : (
                <p>No image available</p>
                )}
            </Col>
            
            </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Upload Image">
                <Upload {...uploadProps} listType="picture-card">
                  {fileList.length === 0 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
            <Col span={18}>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    padding: '8px',
                  }}
                />
              )}
            </Col>
            </Row>
     
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
          <Button style={{ marginLeft: '8px' }} onClick={() => navigate('/')}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default EditStockDataForm;




