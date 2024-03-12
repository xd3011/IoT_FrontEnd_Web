import { Button, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";

interface Props {
    user: User;
    accessToken: string;
    onCancel: () => void;
    onDataUpdated: () => void;
}

const EditUser: React.FC<Props> = ({ user, accessToken, onCancel, onDataUpdated }) => {
    const [name, setName] = useState<string>(user.name);
    const [age, setAge] = useState<number>(user.age);
    const [gender, setGender] = useState<string>(user.gender);
    const [address, setAddress] = useState<string>(user.address);
    const [phone, setPhone] = useState<string>(user.phone);
    const [email, setEmail] = useState<string>(user.email);
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({ name: user.name, age: user.age, gender: user.gender, address: user.address, phone: user.phone, email: user.email });
    }, [user, form]);

    const fetchData = async () => {
        let genderNumber;
        if (gender === "male") {
            genderNumber = -1;
        }
        else if (gender === "female") {
            genderNumber = 1;
        }
        try {
            const resUser = await fetch(`http://localhost:5000/api/user/editUser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({
                    uid: user.uid,
                    name: name,
                    age: age,
                    gender: genderNumber,
                    address: address,
                    phone: phone,
                    email: email,
                }),
            });
            if (resUser.ok) {
                const data = await resUser.json();
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
                rules={[{ required: true, message: 'Please input the user name!' }]}
            >
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Age"
                name="age"
                rules={[{ required: true, message: 'Please input the user age!' }]}
            >
                <Input type="number" value={age} onChange={(e) => setAge(parseInt(e.target.value))} />
            </Form.Item>

            <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: 'Please select the user gender!' }]}
            >
                <Select value={gender} onChange={(value) => setGender(value)}>
                    <Select.Option value="male">Male</Select.Option>
                    <Select.Option value="female">Female</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please input the user address!' }]}
            >
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please input the user phone number!' }]}
            >
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input the user email!' }]}
            >
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="default" style={{ marginRight: '10px' }} onClick={onCancel}>Cancel</Button>
                <Button type="primary" className="btn-submit bg-blue-500" onClick={fetchData}>Submit</Button>
            </Form.Item>
        </Form>
    );
};

export default EditUser;
