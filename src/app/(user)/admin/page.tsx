'use client'
import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, message, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'; // Import icon DeleteOutlined
import type { TableProps } from 'antd';
import { useRouter } from 'next/navigation';

const App: React.FC = () => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [reload, setReload] = useState<boolean>(false);
    let admin: number;
    let accessToken: string;

    const columns: TableProps<User>['columns'] = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'roll',
            key: 'roll',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleChangeRole(record)}>Change Role</Button>
                    <Button danger onClick={() => handleDelete(record)} icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    useEffect(() => {
        if (typeof localStorage !== 'undefined') {
            admin = parseInt(localStorage.getItem('admin') || '0', 10);
            accessToken = localStorage.getItem('accessToken') || '';
            if (admin !== 1) {
                console.error('User is not admin');
                router.push('/room');
                return;
            }
            if (!accessToken) {
                console.error('accessToken not found');
                router.push('/login');
                return;
            }
        } else {
            console.error('localStorage is not available');
            router.push('/login');
            return;
        }
    }, [router]);

    const fetchUsers = async () => {
        try {
            const resUsers = await fetch(`http://localhost:5000/api/user/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                }
            })
            if (resUsers.ok) {
                const data = await resUsers.json();
                if (!data.users) {
                    message.error(data.error);
                } else {
                    const mappedUsers: User[] = data.users.map((user: any, index: number) => {
                        let gender: string;
                        if (user.gender === -1) {
                            gender = "Male";
                        } else if (user.gender === 1) {
                            gender = "Female";
                        } else {
                            gender = "Unknown";
                        }
                        return {
                            uid: user._id,
                            name: user.name,
                            age: user.age,
                            gender: gender,
                            address: user.address,
                            phone: user.phone,
                            email: user.email,
                            roll: user.roll,
                            index: index + 1,
                        };
                    });
                    setUsers(mappedUsers);
                }
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [reload]);

    const handleChangeRole = (record: User) => {
        console.log(`Change role for user ${record.name}`);
    };

    const handleDelete = (record: User) => {
        console.log(`Delete user ${record.name}`);
    };

    return (
        <Table columns={columns} dataSource={users} />
    )
}

export default App;
