import { Button, Form, Input, message } from "antd";
import { useState } from "react";

interface Props {
    accessToken: string;
    onCancel: () => void;
    onDataCreated: () => void;
}

const CreateDeviceType: React.FC<Props> = ({ accessToken, onCancel, onDataCreated }) => {
    const [name, setName] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [form] = Form.useForm();

    const resetForm = () => {
        form.resetFields();
        setName('');
        setImage('');
        setType('');
    };

    const fetchData = async () => {
        try {
            console.log(name, image, type);

            if (!name || !image || !type) {
                message.error('Please fill in all required fields');
                return;
            }
            const resDeviceType = await fetch(`http://localhost:5000/api/deviceType/`, {
                method: 'POST',
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
                    onDataCreated();
                    resetForm();
                    onCancel();
                } else {
                    message.error(data.error);
                }
            }
        } catch (error) {
            console.error('Error creating user:', error);
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
                rules={[
                    { required: true, message: 'Please input device type name!' },
                ]}
            >
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Image"
                name="image"
                rules={[
                    { required: true, message: 'Please input device type image!' },
                ]}
            >
                <Input value={image} onChange={(e) => setImage(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Type"
                name="type"
                rules={[
                    { required: true, message: 'Please input type of device type!' },
                ]}
            >
                <Input value={type} onChange={(e) => setType(e.target.value)} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="default" style={{ marginRight: '10px' }} onClick={() => {
                    resetForm();
                    onCancel();
                }}>Cancel</Button>
                <Button type="primary" className="btn-submit bg-blue-500" onClick={fetchData}>Submit</Button>
            </Form.Item>
        </Form>
    );
};

export default CreateDeviceType;
