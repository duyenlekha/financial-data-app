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
    ShortSqueeze: number;
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

const EditFindData: React.FC<EditStockDataFormProps> = ({ recordId, onClose }) => {

  
  const [data, setData] = useState<StockData[]>([]);
  const navigate = useNavigate();

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5003/api/find-data/get/${recordId}`);
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
    const shortSqueezeValue = values.ShortSqueeze ? 1 : 0;

    const payload: Record<string, any> = {
        Symbol: values.Symbol || '',
        Exchange: values.Exchange || '',
        Date: values.Date ? values.Date.format('YYYY-MM-DD') : null,
        MarketCap: values.MarketCap || 0,
        Float: values.Float || 0,
        Gap: values.Gap || 0,
        PremarketVolume: values.PremarketVolume || 0,
        OpenPrice: values.OpenPrice || 0,
        HighPrice: values.HighPrice || 0,
        LowPrice: values.LowPrice || 0,
        ClosePrice: values.ClosePrice || 0,
        PriceBeforeGap: values.PriceBeforeGap || 0,
        EstimatePriceCover50: values.EstimatePriceCover50 || 0,
        EstimatePriceCover70: values.EstimatePriceCover70 || 0,
        GapHighPricePercent: values.GapHighPricePercent || 0,
        VolumeToPremarketRatio: values.VolumeToPremarketRatio || 0,
        Sector: values.Sector || '',
        VolumeSizeIn: values.VolumeSizeIn || 0,
        DesImageUrl: values.DesImageUrl || '',
        ImageUrl: values.ImageUrl || '',
        ShortSqueeze: shortSqueezeValue,
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

        
        await axios.put(`http://localhost:5003/api/find-data/update/${recordId}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        form.resetFields();
        setFileList([]);
        message.success('Stock data updated successfully');
        setLoading(false);
        navigate('/FindTable');
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
              <Form.Item name="Symbol" label="Symbol" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="Exchange" label="Exchange">
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
              <Form.Item name="PremarketVolume" label="Premarket Volume">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="Volume" label="Volume">
                <InputNumber style={{ width: '100%' }} min={0} max={9999999999} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="GAPPercent" label="GAP Percent">
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
              <Form.Item name="LowPrice" label="Low Price">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="ClosePrice" label="Close Price">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="PriceBeforeGap" label="Price Before Gap">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="EstimatePriceCover50" label="Estimate Price Cover 50">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="EstimatePriceCover70" label="Estimate Price Cover 70">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="GapHighPricePercent" label="Gap High Price Percent">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="VolumeToPremarketRatio" label="Volume to Premarket Ratio">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="Sector" label="Sector">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="VolumeSizeIn" label="Volume Size In">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
            <Form.Item
            name="ShortSqueeze"
            label="ShortSqueeze"
            valuePropName="checked"
            initialValue={data[0]?.ShortSqueeze === 1} 
          >
            <Checkbox />
          </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="DesImageUrl" label="Description">
                <TextArea rows={4} />
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

export default EditFindData;

