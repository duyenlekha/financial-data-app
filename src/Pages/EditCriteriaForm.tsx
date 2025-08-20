import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import axios from 'axios';
import config from './config';

interface EditCriteriaFormProps {
  recordId: number | null;
  onClose: () => void;
}

const EditCriteriaForm: React.FC<EditCriteriaFormProps> = ({ recordId, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(!!recordId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/criteria-data/get-criteria/${recordId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });

        const record = response.data;
        form.setFieldsValue({
          Criteria: record.Criteria,
          Description: record.Description,
        });
      } catch (error) {
        message.error('Failed to load criteria');
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
      Criteria: values.Criteria,
      Description: values.Description,
    };

    try {
      if (recordId === null) {
        await axios.post(`${config.API_BASE_URL}/api/criteria-data/insert-criteria`, payload, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        message.success('Criteria added successfully!');
      } else {
        await axios.put(`${config.API_BASE_URL}/api/criteria-data/update-criteria/${recordId}`, payload, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        message.success('Criteria updated successfully!');
      }

      onClose();
    } catch (error) {
      message.error('Failed to save criteria');
    }
  };

  return (
    <Spin spinning={loading}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="Criteria"
          label="Criteria"
          rules={[{ required: true, message: 'Please enter the criteria' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="Description" label="Description">
          <Input.TextArea rows={3} />
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

export default EditCriteriaForm;
