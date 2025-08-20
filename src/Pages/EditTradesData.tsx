import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Spin, DatePicker, Upload, Select, Row, Col, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { UploadFile, UploadProps } from 'antd/es/upload/interface';
import config from './config';

const { Option } = Select;
const { TextArea } = Input;

interface TradeData {
    TradeID: number;
    Symbol: string;
    TradeDate: string;
    Position: string;
    Shares: number;
    PL: number;
    Setup: string;
    Description: string;
    ImageUrl: string;
}

interface EditTradeDataProps {
    recordId: number;
    onClose: () => void;
}

const EditTradesData: React.FC<EditTradeDataProps> = ({ recordId, onClose }) => {
    const [data, setData] = useState<TradeData[]>([]);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/api/trades-data/get/${recordId}`, {
                    headers: {
                      'ngrok-skip-browser-warning': 'true'
                    }
                  });
                const fetchedData: TradeData[] = response.data;
                setData(fetchedData);
                
                if (fetchedData.length > 0) {
                    const record = fetchedData[0];
                    form.setFieldsValue({
                        ...record,
                        TradeDate: record.TradeDate ? moment(record.TradeDate) : null,
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
                message.error('Failed to fetch trade data');
            }
        };

        if (recordId) {
            fetchData();
        }
    }, [recordId, form]);

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
        },
        maxCount: 1,
    };

    const handleUpdate = async (values: any) => {
        setLoading(true);
        
        const payload: Record<string, any> = {
            Symbol: values.Symbol || '',
            TradeDate: values.TradeDate ? values.TradeDate.format('YYYY-MM-DD') : null,
            Position: values.Position || '',
            Shares: values.Shares || 0,
            PL: values.PL || 0,
            LocateFee: values.LocateFee || 0,
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
            const file = fileList[0].originFileObj;
            payload.ImageUrl = file.name;
        } else {
            payload.ImageUrl = data[0].ImageUrl;
        }

        try {
            await axios.put(`${config.API_BASE_URL}/api/trades-data/update/${recordId}`, payload, {
                headers: { 'ngrok-skip-browser-warning': 'true' },
            });
            form.resetFields();
            setFileList([]);
            message.success('Trade data updated successfully');
            setLoading(false);
            navigate('/TradesTable');
        } catch (error) {
            setLoading(false);
            message.error('Failed to update trade data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Spin spinning={loading}>
            <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Row gutter={16}>
                    <Col span={6}><Form.Item name="Symbol" label="Symbol" rules={[{ required: true }]}><Input /></Form.Item></Col>
                    <Col span={6}><Form.Item name="TradeDate" label="Trade Date" rules={[{ required: true }]}><DatePicker /></Form.Item></Col>
                    <Col span={6}><Form.Item name="Position" label="Position"><Input /></Form.Item></Col>
                    <Col span={6}><Form.Item name="Shares" label="Shares"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
                </Row>
                <Row gutter={16}>
                    <Col span={6}><Form.Item name="PL" label="P/L"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
                    <Col span={6}><Form.Item name="LocateFee" label="LocateFee"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
                    <Col span={24}><Form.Item name="Setup" label="Setup"><TextArea rows={4} /></Form.Item></Col>
                    <Col span={24}><Form.Item name="Description" label="Description"><TextArea rows={4} /></Form.Item></Col>
                </Row>
                <Form.Item label="Upload Image"><Upload {...uploadProps} listType="picture-card"><UploadOutlined /></Upload></Form.Item>
                <Form.Item><Button type="primary" htmlType="submit">Update</Button></Form.Item>
            </Form>
        </Spin>
    );
};

export default EditTradesData;
