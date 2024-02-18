import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message } from 'antd';

interface Home {
    hid: string;
    name: string;
    address: string;
}

interface Props {
    home: Home;
    onCancel: () => void;
    accessToken: string;
    onDataUpdated: () => void;
}

const EditHome: React.FC<Props> = ({ home, onCancel, accessToken, onDataUpdated }) => {
    const [name, setName] = useState<string>(home.name);
    const [address, setAddress] = useState<string>(home.address);
    const [form] = Form.useForm();

    useEffect(() => {
        setName(home.name);
        setAddress(home.address);
        form.setFieldsValue({ name: home.name, address: home.address });
    }, [home, form]);

    const fetchData = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/home/${home.hid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ home_name: name, address: address }),
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
            console.error('Error updating home:', error);
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
                <Input className="w-full" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please input the description!' }]}
            >
                <Input.TextArea
                    className="w-full"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
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

export default EditHome;
