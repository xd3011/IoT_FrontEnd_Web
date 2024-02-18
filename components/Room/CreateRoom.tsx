import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';

interface Props {
    accessToken: string;
    onCreate: () => void;
    onCancel: () => void;
    homeSelect: string;
}

const CreateRoom: React.FC<Props> = ({ accessToken, onCreate, onCancel, homeSelect }) => {
    const [roomName, setRoomName] = useState<string>('');
    const [form] = Form.useForm();

    const createRoom = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ room_name: roomName, hid: homeSelect }),
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
            console.error('Error creating room:', error);
        }
    };

    const resetForm = () => {
        form.resetFields();
        setRoomName('');
    };

    return (
        <Form
            form={form}
            name="createRoom"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            className="max-w-3xl mx-auto"
            autoComplete="off"
        >
            <Form.Item
                label="Room Name"
                name="roomName"
                rules={[{ required: true, message: 'Please input the room name!' }]}
            >
                <Input className="w-full" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="button" className="btn-submit bg-blue-500" onClick={createRoom}>
                    Create
                </Button>
                <Button type="default" onClick={resetForm} style={{ marginLeft: '10px' }}>Reset</Button>
            </Form.Item>
        </Form>
    );
};

export default CreateRoom;
