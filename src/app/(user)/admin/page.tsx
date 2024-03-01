'use client'
import React, { useEffect, useState } from 'react';
import { Space, Table, message, Button, Dropdown, Menu, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { useRouter } from 'next/navigation';
import EditUser from "../../../../components/User/EditUser";


const App: React.FC = () => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [reload, setReload] = useState<boolean>(false);
    const [userSelect, setUserSelect] = useState<User>();

    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
    let admin: number;
    let accessToken: string;

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
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Dropdown
                        overlay={
                            <Menu onClick={(e) => handleEdit(e, record)}>
                                <Menu.Item key="editUser">Edit User</Menu.Item>
                                <Menu.Item key="changeRole">Change Role</Menu.Item>
                            </Menu>
                        }
                    >
                        <Button icon={<EditOutlined />} />
                    </Dropdown>
                    <Button danger onClick={() => {
                        setUserSelect(record);
                        setDeleteModalVisible(true);
                        console.log(`Delete user ${record.name}`);
                    }} icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];



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
                            role: user.role,
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

    const handleEdit = (e: any, record: User) => {
        const key = e.key;
        if (key === 'editUser') {
            setUserSelect(record);
            setEditModalVisible(true);
        } else if (key === 'changeRole') {
            console.log(`Change role for user ${record.name}`);
        }
    };



    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/user/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ uid: userSelect?.uid })
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.error) {
                    message.success(data.message);
                    setReload(prev => !prev);
                } else {
                    message.error(data.error);
                }
            } else {
                console.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setDeleteModalVisible(false);
        }
    };

    const handleCancelEditModal = () => {
        setEditModalVisible(false);
    };

    const handleDataUpdate = () => {
        setReload(prev => !prev);
    }

    return (
        <div>
            <Table columns={columns} dataSource={users} />
            <Modal
                title="Edit User"
                visible={editModalVisible}
                onCancel={handleCancelEditModal}
                footer={null}
            >
                {userSelect && <EditUser user={userSelect} accessToken={accessToken} onDataUpdated={handleDataUpdate} onCancel={handleCancelEditModal} />}
            </Modal>
            <Modal
                title="Delete User"
                visible={deleteModalVisible}
                onOk={() => handleDelete()}
                onCancel={() => setDeleteModalVisible(false)}
                okButtonProps={{ type: "primary", danger: true }}
            >
                <p>Are you sure you want to delete user?</p>
            </Modal>
        </div>
    )
}

export default App;
