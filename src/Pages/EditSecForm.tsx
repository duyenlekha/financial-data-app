import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, DatePicker, Spin } from 'antd';
import axios from 'axios';
import moment from 'moment';
import config from './config';

interface EditSecFormProps {
  recordId: number | null;
  onClose: () => void;
}

const EditSecForm: React.FC<EditSecFormProps> = ({ recordId, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(!!recordId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/sec-data/get-sec/${recordId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });

        const record = response.data;
        form.setFieldsValue({
          Symbol: record.Symbol,
          Description: record.Description,
          DateSubmitted: record.DateSubmitted ? moment(record.DateSubmitted) : null
        });
      } catch (error) {
        message.error('Failed to load SEC record');
      } finally {
        setLoading(false);
      }
    };

    if (recordId !== null) {
      fetchData();
    } else {
      form.resetFields();
    }
  }, [recordId, form]);

  const handleSubmit = async (values: any) => {
    const payload = {
      Symbol: values.Symbol,
      Description: values.Description,
      DateSubmitted: values.DateSubmitted ? values.DateSubmitted.format('YYYY-MM-DD') : null
    };

    try {
      if (recordId === null) {
        await axios.post(`${config.API_BASE_URL}/api/sec-data/insert-sec`, payload, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        message.success('SEC record added successfully!');
      } else {
        await axios.put(`${config.API_BASE_URL}/api/sec-data/update-sec/${recordId}`, payload, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        message.success('SEC record updated successfully!');
      }

      onClose();
    } catch (error) {
      message.error('Failed to save SEC record');
    }
  };

  return (
    <Spin spinning={loading}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="Symbol"
          label="Symbol"
          rules={[{ required: true, message: 'Please enter the symbol' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="Description" label="Description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item name="DateSubmitted" label="Date Submitted">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {recordId === null ? 'Add' : 'Update'}
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onClose}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default EditSecForm;
