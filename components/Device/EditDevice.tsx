import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, message } from 'antd';
import deviceTypes from '../../types/deviceTypes';

const { Option } = Select;

interface Props {
    device: Device;
    onCancel: () => void;
    accessToken: string;
    onDataUpdated: () => void;
}

const EditDevice: React.FC<Props> = ({ device, onCancel, accessToken, onDataUpdated }) => {
    const [deviceName, setDeviceName] = useState<string>();
    const [gatewayCode, setGatewayCode] = useState<string>();
    const [macAddress, setMacAddress] = useState<string>();
    const [form] = Form.useForm();

    useEffect(() => {
        setDeviceName(device.device_name);
        setGatewayCode(device.gateway_code);
        setMacAddress(device.mac_address);
        form.setFieldsValue({ name: device.device_name, gatewayCode: device.gateway_code, macAddress: device.mac_address });
    }, [device, form]);

    const fetchData = async () => {
        try {
            await form.validateFields(); // Validate fields before submission

            const res = await fetch(`http://localhost:5000/api/device/edit/${device.did}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ device_name: deviceName, gateway_code: gatewayCode, mac_address: macAddress }),
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.error) {
                    message.success(data.message);
                    onDataUpdated();
                    onCancel();
                } else {
                    message.error(data.error);
                }
            }
        } catch (error) {
            console.error('Error updating device:', error);
        }
    };

    return (
        <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            className="max-w-3xl mx-auto"
            autoComplete="off"
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input the title!' }]}
            >
                <Input className="w-full" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Gateway Code"
                name="gatewayCode"
                rules={[{ required: true, message: 'Please input the gateway code!' }]}
            >
                <Input className="w-full" value={gatewayCode} onChange={(e) => setGatewayCode(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Mac Address"
                name="macAddress"
                rules={[{ required: true, message: 'Please input the mac address!' }]}
            >
                <Input className="w-full" value={macAddress} onChange={(e) => setMacAddress(e.target.value)} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="button" className="btn-submit bg-blue-500" onClick={fetchData}>
                    Edit
                </Button>
                <Button type="default" onClick={onCancel} style={{ marginLeft: '10px' }}>Cancel</Button>
            </Form.Item>
        </Form>
    );
};

export default EditDevice;
