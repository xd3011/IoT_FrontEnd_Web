import { Button, Form, Input, message } from "antd";
import { useEffect, useState } from "react";

interface Props {
    deviceType: DeviceType;
    accessToken: string;
    onCancel: () => void;
    onDataUpdated: () => void;
}

const EditDeviceType: React.FC<Props> = ({ deviceType, accessToken, onCancel, onDataUpdated }) => {
    const [name, setName] = useState<string>(deviceType.name);
    const [image, setImage] = useState<string>(deviceType.image);
    const [type, setType] = useState<string>(deviceType.type);
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({ name: deviceType.name, image: deviceType.image, type: deviceType.type });
    }, [deviceType, form]);

    const fetchData = async () => {
        try {
            const resDeviceType = await fetch(`http://localhost:5000/api/deviceType/${deviceType.dtid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({
                    name: name,
                    image: image,
                    type: type,
                }),
            });
            if (resDeviceType.ok) {
                const data = await resDeviceType.json();
                if (!data.error) {
                    message.success(data.message);
                    onDataUpdated();
                    onCancel();
                } else {
                    message.error(data.error);
                }
            }
        } catch (error) {
            console.error('Error updating user:', error);
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
                rules={[{ required: true, message: 'Please input the device type name!' }]}
            >
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Image"
                name="image"
                rules={[{ required: true, message: 'Please input the device type image!' }]}
            >
                <Input value={image} onChange={(e) => setImage(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Type"
                name="type"
                rules={[{ required: true, message: 'Please input type of device type!' }]}
            >
                <Input value={type} onChange={(e) => setType(e.target.value)} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="default" style={{ marginRight: '10px' }} onClick={onCancel}>Cancel</Button>
                <Button type="primary" className="btn-submit bg-blue-500" onClick={fetchData}>Submit</Button>
            </Form.Item>
        </Form>
    );
};

export default EditDeviceType;
