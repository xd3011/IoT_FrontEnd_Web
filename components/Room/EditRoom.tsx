import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message } from 'antd';

interface Room {
    rid: string;
    name: string;
}

interface Props {
    room: Room;
    onCancel: () => void;
    accessToken: string;
    onDataUpdated: () => void; // Thêm callback để thông báo cho component cha khi dữ liệu được cập nhật
}

const EditRoom: React.FC<Props> = ({ room, onCancel, accessToken, onDataUpdated }) => {
    const [roomName, setRoomName] = useState<string>(room.name);
    const [form] = Form.useForm();

    useEffect(() => {
        setRoomName(room.name);
        form.setFieldsValue({ roomName: room.name });
    }, [room, form]);

    const fetchData = async () => {
        try {
            const resRoom = await fetch(`http://localhost:5000/api/room/${room.rid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ room_name: roomName }),
            });
            if (resRoom.ok) {
                const data = await resRoom.json();
                if (!data.error) {
                    message.success(data.message);
                    onDataUpdated();
                    onCancel();
                } else {
                    message.error(data.error);
                }
            }
        } catch (error) {
            console.error('Error updating room:', error);
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
                label="Room Name"
                name="roomName"
                rules={[{ required: true, message: 'Please input the room name!' }]}
            >
                <Input className="w-full" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="button" className="btn-submit bg-blue-500" onClick={fetchData}>
                    Submit
                </Button>
                <Button type="default" onClick={onCancel} style={{ marginLeft: '10px' }}>Cancel</Button>
            </Form.Item>
        </Form>
    );
};

export default EditRoom;
