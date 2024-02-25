import React, { useState } from 'react';
import { Button, Form, Input, message, Select } from 'antd';
import deviceTypes from '../../types/deviceTypes';

const { Option } = Select;

interface Props {
    rooms: Room[];
    accessToken: string;
    onCreate: () => void;
    onCancel: () => void;
}

const CreateDevice: React.FC<Props> = ({ rooms, accessToken, onCreate, onCancel }) => {
    const [deviceName, setDeviceName] = useState<string>('');
    const [gatewayCode, setGatewayCode] = useState<string>('');
    const [macAddress, setMacAddress] = useState<string>('');
    const [deviceType, setDeviceType] = useState<DeviceType | undefined>(undefined);
    const [roomSelect, setRoomSelect] = useState<Room | undefined>(undefined);
    const [form] = Form.useForm();

    const createDevice = async () => {
        try {
            await form.validateFields(); // Validate fields before submission
            const res = await fetch('http://localhost:5000/api/device', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ rid: roomSelect?.rid, device_name: deviceName, gateway_code: gatewayCode, mac_address: macAddress, device_type: deviceType?.id }),
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.error) {
                    message.success(data.message);
                    onCreate();
                    resetForm();
                    onCancel();
                } else {
                    message.error(data.error);
                }
            }
        } catch (error) {
            console.error('Error creating home:', error);
        }
    };

    const resetForm = () => {
        form.resetFields();
        setDeviceName('');
        setGatewayCode('');
        setMacAddress('');
        setDeviceType(undefined);
        setRoomSelect(undefined);
    };

    return (
        <Form
            form={form}
            name="createDevice"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            className="max-w-3xl mx-auto"
            autoComplete="off"
        >
            <Form.Item
                label="Room Select"
                name="roomSelect"
                rules={[{ required: true, message: 'Please select the room!' }]}
            >
                <Select
                    className="w-full"
                    value={roomSelect ? roomSelect.name : undefined}
                    onChange={(value) => {
                        const selectedRoom = rooms.find(type => type.name === value);
                        setRoomSelect(selectedRoom);
                    }}
                >
                    {rooms.map((room) => (
                        <Option key={room.rid} value={room.name}>
                            {room.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Device Name"
                name="deviceName"
                rules={[{ required: true, message: 'Please input the device name!' }]}
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
                label="MAC Address"
                name="macAddress"
                rules={[{ required: true, message: 'Please input the MAC address!' }]}
            >
                <Input className="w-full" value={macAddress} onChange={(e) => setMacAddress(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Device Type"
                name="deviceType"
                rules={[{ required: true, message: 'Please select the device type!' }]}
            >
                <Select
                    className="w-full"
                    value={deviceType ? deviceType.name : undefined}
                    onChange={(value) => {
                        const selectedDeviceType = deviceTypes.find(type => type.name === value);
                        setDeviceType(selectedDeviceType);
                    }}
                >
                    {deviceTypes.map((type) => (
                        <Option key={type.name} value={type.name}>
                            {type.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="button" className="btn-submit bg-blue-500" onClick={createDevice}>
                    Create
                </Button>
                <Button type="default" onClick={resetForm} style={{ marginLeft: '10px' }}>Reset</Button>
            </Form.Item>
        </Form>
    );
};

export default CreateDevice;
