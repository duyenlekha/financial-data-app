import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import axios from 'axios';
import config from './config';

interface EditRulesFormProps {
  recordId: number | null;
  onClose: () => void;
}

const EditRulesForm: React.FC<EditRulesFormProps> = ({ recordId, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(!!recordId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/rules-data/get-rules/${recordId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });

        const record = response.data;
        form.setFieldsValue({
          Rules: record.Rules
        });
      } catch (error) {
        message.error('Failed to load rule');
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
      Rules: values.Rules
    };

    try {
      if (recordId === null) {
        await axios.post(`${config.API_BASE_URL}/api/rules-data/insert-rules`, payload, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        message.success('Rule added successfully!');
      } else {
        await axios.put(`${config.API_BASE_URL}/api/rules-data/update-rules/${recordId}`, payload, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        message.success('Rule updated successfully!');
      }

      onClose();
    } catch (error) {
      message.error('Failed to save rule');
    }
  };

  return (
    <Spin spinning={loading}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="Rules"
          label="Rule"
          rules={[{ required: true, message: 'Please enter the rule' }]}
        >
          <Input.TextArea rows={4} />
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

export default EditRulesForm;
