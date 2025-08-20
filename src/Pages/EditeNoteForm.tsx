import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import axios from 'axios';
import config from './config';

interface EditNoteFormProps {
  recordId: number | null;
  onClose: () => void;
}

const EditNoteForm: React.FC<EditNoteFormProps> = ({ recordId, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(!!recordId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/note-data/get-note/${recordId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });

        const record = response.data;
        form.setFieldsValue({
          Note: record.Note
        });
      } catch (error) {
        message.error('Failed to load note');
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
      Note: values.Note
    };

    try {
      if (recordId === null) {
        await axios.post(`${config.API_BASE_URL}/api/note-data/insert-note`, payload, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        message.success('Note added successfully!');
      } else {
        await axios.put(`${config.API_BASE_URL}/api/note-data/update-note/${recordId}`, payload, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        message.success('Note updated successfully!');
      }

      onClose();
    } catch (error) {
      message.error('Failed to save note');
    }
  };

  return (
    <Spin spinning={loading}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="Note"
          label="Note"
          rules={[{ required: true, message: 'Please enter the note' }]}
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

export default EditNoteForm;
