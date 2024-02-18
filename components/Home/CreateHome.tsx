import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';

interface Props {
    accessToken: string;
    onCreate: () => void;
    onCancel: () => void;
}

const CreateHome: React.FC<Props> = ({ accessToken, onCreate, onCancel }) => {
    const [homeName, setHomeName] = useState<string>('');
    const [homeAddress, setHomeAddress] = useState<string>('');
    const [form] = Form.useForm();

    const createHome = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/home', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ home_name: homeName, address: homeAddress }),
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
        setHomeName('');
        setHomeAddress('');
    };

    return (
        <Form
            form={form}
            name="createHome"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            className="max-w-3xl mx-auto"
            autoComplete="off"
        >
            <Form.Item
                label="Home Name"
                name="homeName"
                rules={[{ required: true, message: 'Please input the home name!' }]}
            >
                <Input className="w-full" value={homeName} onChange={(e) => setHomeName(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Home Address"
                name="homeAddress"
                rules={[{ required: true, message: 'Please input the home address!' }]}
            >
                <Input className="w-full" value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="button" className="btn-submit bg-blue-500" onClick={createHome}>
                    Create
                </Button>
                <Button type="default" onClick={resetForm} style={{ marginLeft: '10px' }}>Reset</Button>
            </Form.Item>
        </Form>
    );
};

export default CreateHome;
