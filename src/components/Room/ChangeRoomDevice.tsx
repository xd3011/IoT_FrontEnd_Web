import { Select, Button, Form, message } from 'antd';
import { useState, useEffect } from 'react';

const { Option } = Select;

interface Props {
    device: Device;
    rooms?: Room[];
    accessToken: string;
    onDataUpdated: (device: Device, rid: string) => void;
    onCancel: () => void;
}

const AddDeviceInRoom: React.FC<Props> = ({ device, rooms, accessToken, onDataUpdated, onCancel }) => {
    const [selectedRoom, setSelectedRoom] = useState<string>('');
    const [form] = Form.useForm();

    useEffect(() => {
        const matchingRoom = rooms?.find(room => room.rid === device.rid);
        if (matchingRoom) {
            setSelectedRoom(matchingRoom.rid);
        }
        form.setFieldsValue({ room: matchingRoom?.rid });
    }, [device, rooms]);

    const handleRoomChange = (value: string) => {
        setSelectedRoom(value);
    };

    const handleAddDevice = async () => {
        try {
            const changeRoomDevice = await fetch(`http://localhost:5000/api/device/changeRoomDevice/${device.did}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ rid: selectedRoom })
            });
            if (changeRoomDevice.ok) {
                const data = await changeRoomDevice.json();
                if (!data.message) {
                    message.warning(data.error);
                } else {
                    message.success(data.message);
                    onDataUpdated(device, selectedRoom);
                    onCancel();
                }
            } else {
                const data = await changeRoomDevice.json();
                message.error(data.error);
            }
        } catch (error) {
            console.error('Error fetching device data:', error);
        }
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
                label="Room"
                name="room"
                rules={[{ required: true, message: 'Please select the room!' }]}
            >
                <Select
                    className="w-full"
                    value={selectedRoom}
                    onChange={handleRoomChange}
                >
                    {rooms && rooms.map((room: Room) => (
                        <Option key={room.rid} value={room.rid}>
                            {room.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="button" className="btn-submit bg-blue-500" onClick={() => handleAddDevice()}>
                    Add to Room
                </Button>
                <Button type="default" onClick={() => onCancel()} style={{ marginLeft: '10px' }}>Cancel</Button>
            </Form.Item>
        </Form>
    );
};

export default AddDeviceInRoom;