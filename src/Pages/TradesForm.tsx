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
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { UploadFile, UploadProps } from 'antd/es/upload/interface';

const { TextArea } = Input;
const { Option } = Select;

const TradesForm: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');
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
    onChange: ({ fileList: newFileList }) => {
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

  const onFinish = async (values: any) => {
    setLoading(true);
    
    const payload: Record<string, any> = {
      Symbol: values.Symbol || '',
      Exchange: values.Exchange || '',
      Sector: values.Sector || '',
      TradeDate: values.TradeDate ? values.TradeDate.format('YYYY-MM-DD') : null,
      Position: values.Position || '',
      Shares: values.Shares || 0,
      InAvg: values.InAvg || 0,
      OutAvg: values.OutAvg || 0,
      PL: values.PL || 0,
      LocateFee: values.LocateFee || 0,
      Percentage: values.Percentage || 0,
      NetGainLoss: values.NetGainLoss || 0,
      Setup: values.Setup || '',
      Description: values.Description || '',
      ImageUrl: values.ImageUrl || '',
    };

    if (!payload.TradeDate) {
      message.error('Please select a trade date');
      setLoading(false);
      return;
    }

    if (fileList.length > 0 && fileList[0].originFileObj) {
      payload.ImageUrl = fileList[0].originFileObj.name;
    }

    console.log("payload", payload)

    try {
      await axios.post('http://localhost:5003/api/trades-data/insert', payload);
      message.success('Trade data submitted successfully');
      form.resetFields();
      setFileList([]);
      setPreviewImage('');
    } catch (error) {
      console.error('Error submitting trade data:', error);
      message.error('Failed to submit trade data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
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
          <Form.Item name="Sector" label="Sector">
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="TradeDate" label="Trade Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="Position" label="Position">
            <Select placeholder="Select Position">
              <Option value="Long">Long</Option>
              <Option value="Short">Short</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="Shares" label="Shares">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="InAvg" label="In Avg">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="OutAvg" label="Out Avg">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="PL" label="Profit/Loss">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="LocateFee" label="LocateFee">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="Setup" label="Setup">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="Description" label="Description">
            <TextArea rows={4} />
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
              style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', border: '1px solid #d9d9d9', borderRadius: '4px', padding: '8px' }}
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

export default TradesForm;
