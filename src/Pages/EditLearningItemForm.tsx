import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import axios from 'axios';
import config from './config';

interface EditLearningItemFormProps {
  recordId: number | null;
  onClose: () => void;
}

const EditLearningItemForm: React.FC<EditLearningItemFormProps> = ({ recordId, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(!!recordId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/learning-items/get-learning-item/${recordId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });

        const record = response.data;
        form.setFieldsValue({
          ThingToLearn: record.ThingToLearn,
          Summary: record.Summary,
          Source: record.Source
        });
      } catch (error) {
        message.error('Failed to load item');
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
      ThingToLearn: values.ThingToLearn,
      Summary: values.Summary,
      Source: values.Source
    };

    try {
      if (recordId === null) {
        await axios.post(`${config.API_BASE_URL}/api/learning-items/insert-learning-item`, payload, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        message.success('Learning item added successfully!');
      } else {
        await axios.put(`${config.API_BASE_URL}/api/learning-items/update-learning-item/${recordId}`, payload, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        message.success('Learning item updated successfully!');
      }

      onClose();
    } catch (error) {
      message.error('Failed to save item');
    }
  };

  return (
    <Spin spinning={loading}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="ThingToLearn"
          label="Thing To Learn"
          rules={[{ required: true, message: 'Please enter the topic' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="Summary"
          label="Summary"
          rules={[{ required: true, message: 'Please enter the summary' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="Source"
          label="Source"
          rules={[{ required: true, message: 'Please enter the source' }]}
        >
          <Input />
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

export default EditLearningItemForm;
