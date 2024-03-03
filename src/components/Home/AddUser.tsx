import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';

interface Props {
    accessToken: string;
    onCreate: () => void;
    onCancel: () => void;
    homeSelect: string;
}

const AddUser: React.FC<Props> = ({ accessToken, onCreate, onCancel, homeSelect }) => {
    const [user, setUser] = useState<string>('');
    const [form] = Form.useForm();

    const addUser = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/user/addUserToHome', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ uid: user, hid: homeSelect }),
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.error) {
                    message.success(data.message);
                    onCreate();
                    resetForm();
                } else {
                    message.error(data.error);
                }
            }
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const resetForm = () => {
        form.resetFields();
        setUser('');
    };

    return (
        <Form
            form={form}
            name="addUser"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            className="max-w-3xl mx-auto mt-4"
            autoComplete="off"
        >
            <Form.Item
                label="User Is:"
                name="username"
                rules={[{ required: true, message: 'Please input the username!' }]}
            >
                <Input className="w-full" value={user} onChange={(e) => setUser(e.target.value)} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="button" className="btn-submit bg-blue-500" onClick={addUser}>
                    Add User
                </Button>
                <Button type="default" onClick={resetForm} style={{ marginLeft: '10px' }}>Reset</Button>
                <Button type="default" onClick={onCancel} style={{ marginLeft: '10px' }}>Cancel</Button>
            </Form.Item>
        </Form>
    );
};

export default AddUser;
