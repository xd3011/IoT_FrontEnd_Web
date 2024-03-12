import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import * as Validators from '@/components/Validation';

interface Props {
    accessToken: string;
    onCancel: () => void;
    onDataCreated: () => void;
}

const CreateAccount: React.FC<Props> = ({ accessToken, onCancel, onDataCreated }) => {
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [form] = Form.useForm();

    const resetForm = () => {
        form.resetFields();
        setUserName('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setPhone('');
        setName('');
    };

    const fetchData = async () => {
        try {
            const resUser = await fetch(`http://localhost:5000/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_name: userName,
                    pass_word: password,
                    email: email,
                    phone: phone,
                    name: name,
                }),
            });
            if (resUser.ok) {
                const data = await resUser.json();
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

    const validateUserName = () => {
        const valid = Validators.isUsername(userName);
        if (valid.error) {
            return Promise.reject(valid.error);
        } else {
            return Promise.resolve();
        }
    };

    const validatePassword = () => {
        const valid = Validators.isPassword(password);
        if (valid.error) {
            return Promise.reject(valid.error);
        } else {
            return Promise.resolve();
        }
    };

    const validateConfirmPassword = () => {
        const valid = Validators.isConfirmPassword(password, confirmPassword);
        if (valid.error) {
            return Promise.reject(valid.error);
        } else {
            return Promise.resolve();
        }
    };

    const validatePhone = () => {
        const valid = Validators.isPhoneNumber(phone);
        if (valid.error) {
            return Promise.reject(valid.error);
        } else {
            return Promise.resolve();
        }
    };

    const validateEmail = () => {
        const valid = Validators.isEmail(email);
        if (valid.error) {
            return Promise.reject(valid.error);
        } else {
            return Promise.resolve();
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
                label="User Name"
                name="user_name"
                rules={[
                    { required: true, message: 'Please input the user name!' },
                    { validator: validateUserName }
                ]}
            >
                <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                    { required: true, message: 'Please input the password!' },
                    { validator: validatePassword }
                ]}
            >
                <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                    { required: true, message: 'Please confirm your password!' },
                    { validator: validateConfirmPassword }
                ]}
            >
                <Input.Password value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: 'Please input the email!' },
                    { validator: validateEmail }
                ]}
            >
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Phone"
                name="phone"
                rules={[
                    { required: true, message: 'Please input the phone number!' },
                    { validator: validatePhone }
                ]}
            >
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input the name!' }]}
            >
                <Input value={name} onChange={(e) => setName(e.target.value)} />
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

export default CreateAccount;
