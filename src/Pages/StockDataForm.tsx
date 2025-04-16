import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Row,
  Col,
  message,
  Upload,
  Select,
  Checkbox
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { UploadFile, UploadProps } from 'antd/es/upload/interface';

const { TextArea } = Input;
const { Option } = Select;

const StockDataForm: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileListYearlyImage, setFileListYearlyImage] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewImageYearlyImage, setPreviewImageYearlyImage] = useState<string>('');
  const [loading, setLoading] = useState(false);

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

  const uploadPropsYearlyImage: UploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    fileList: fileListYearlyImage,
    onChange: ({ fileList }: { fileList: UploadFile[] }) => {
      setFileListYearlyImage(fileList);
      if (fileList.length > 0) {
        const reader = new FileReader();
        reader.onload = () => setPreviewImageYearlyImage(reader.result as string);
        reader.readAsDataURL(fileList[0].originFileObj as File);
      } else {
        setPreviewImageYearlyImage('');
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


  const onFinish = async (values: any) => {
    setLoading(true);

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
      Short: values.NoShort || 0,
      ImageUrl: values.ImageUrl || '',
      YearlyImageUrl: values.YearlyImageUrl || '',
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
      payload.ImageUrl = '';
    }

    if (fileListYearlyImage.length > 0 && fileListYearlyImage[0].originFileObj) {
      const fileYearlyImage = fileListYearlyImage[0].originFileObj;
      payload.YearlyImage = fileYearlyImage.name;
    } else {
      payload.YearlyImage = '';
    }

    // Calculated fields
    payload.EstimateVolumePercentage = calculateEstimateVolumePercentage(
      payload.OpenHourVolume,
      payload.PreMarketVolume
    );
    payload.PriceOpenPercentage = calculatePriceOpenPercentage(payload.OpenPrice, payload.HighPrice);

    console.log("tt", payload)

    try {
      await axios.post('http://localhost:5003/api/financial-data/insert', payload);
      message.success('Data submitted successfully');
      form.resetFields();
      setFileList([]);
      setPreviewImage('');
    } catch (error) {
      console.error('Error submitting data:', error);
      message.error('Failed to submit data');
    } finally {
      setLoading(false);
    }
  };




  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="ShortType" label="Short Type">
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
    max={9999999999} // Adjust this based on your database schema
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
        <Form.Item name="Short" label="Short" valuePropName="checked">
          <Checkbox defaultChecked={true} />
        </Form.Item>
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
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default StockDataForm;

