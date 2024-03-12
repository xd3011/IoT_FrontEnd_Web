'use client'
import React, { useEffect, useState } from 'react';
import { Space, Table, message, Button, Dropdown, Menu, Modal, Input } from 'antd';
import { DeleteOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { useRouter } from 'next/navigation';
import EditUser from "../../../components/User/EditUser";
import CreateAccount from "../../../components/User/CreateAdminAccount";
import type { SearchProps } from 'antd/es/input/Search';

const { Search } = Input;

const App: React.FC = () => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [reload, setReload] = useState<boolean>(false);
    const [userSelect, setUserSelect] = useState<User>();

    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
    const [changeAdminModalVisible, setChangeAdminModalVisible] = useState<boolean>(false);
    const [changeUserModalVisible, setChangeUserModalVisible] = useState<boolean>(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    let admin: number;
    let accessToken: string;

    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    const handleTableChange = (pagination: any) => {
        setPagination(pagination);
    };

    if (typeof localStorage !== 'undefined') {
        admin = parseInt(localStorage.getItem('admin') || '0', 10);
        accessToken = localStorage.getItem('accessToken') || '';
        if (admin !== 1) {
            console.error('User is not admin');
            router.push('/home');
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
            render: (text) => text.charAt(0).toUpperCase() + text.slice(1),
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
                                <Menu.Item key="changeAdminRole">Change Role To Admin</Menu.Item>
                                <Menu.Item key="changeUserRole">Change Role To User</Menu.Item>
                            </Menu>
                        }
                    >
                        <Button icon={<EditOutlined />} />
                    </Dropdown>
                    <Button danger onClick={() => {
                        setUserSelect(record);
                        setDeleteModalVisible(true);
                    }} icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    const fetchUsers = async () => {
        try {
            const resUsers = await fetch(`http://localhost:5000/api/user/?search=${searchValue}`, {
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
                    await setUsers(mappedUsers);
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
    }, [reload, searchValue]);

    const handleEdit = (e: any, record: User) => {
        const key = e.key;
        setUserSelect(record);
        if (key === 'editUser') {
            setEditModalVisible(true);
        } else if (key === 'changeAdminRole') {
            setChangeAdminModalVisible(true);
        } else if (key === 'changeUserRole') {
            setChangeUserModalVisible(true);
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

    const handleChangeAdmin = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/user/changeUserToAdmin`, {
                method: 'PUT',
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
                const data = await res.json();
                message.error(data.error);
            }
        } catch (error) {
            console.error('Error change role to admin:', error);
        } finally {
            setChangeAdminModalVisible(false);
        }
    }

    const handleChangeUser = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/user/changeRoleToUser`, {
                method: 'PUT',
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
                const data = await res.json();
                message.error(data.error);
            }
        } catch (error) {
            console.error('Error change role to user:', error);
        } finally {
            setChangeUserModalVisible(false);
        }
    }

    const handleCancelEditModal = () => {
        setEditModalVisible(false);
    };

    const handleDataUpdate = () => {
        setReload(prev => !prev);
    }

    const handleCreateAccount = () => {
        setCreateModalVisible(true);
    };

    const handleCancelCreateModal = () => {
        setCreateModalVisible(false);
    }

    const handleSearch = async (e: any) => {
        console.log(e.target.value);
        await setSearchValue(e.target.value);
    }

    const onSearch: SearchProps['onSearch'] = () => {
        handleDataUpdate();
    }
    return (
        <div>
            <div className="flex items-center">
                <Button onClick={handleCreateAccount} type="primary" className="bg-blue-500 font-bold py-2 px-4 pb-8 ml-4 h-10 mt-2 mb-2" icon={<UserOutlined />}>
                    Create Account
                </Button>
                <div className="ml-auto">
                    <Search placeholder="input search text" onChange={handleSearch} onSearch={onSearch} enterButton className="rounded-lg bg-blue-500" />
                </div>
            </div>
            <Table columns={columns} dataSource={users} pagination={pagination}
                onChange={handleTableChange} />
            <Modal
                title="Create Account"
                visible={createModalVisible}
                onCancel={handleCancelCreateModal}
                footer={null}
            >
                <CreateAccount accessToken={accessToken} onDataCreated={handleDataUpdate} onCancel={handleCancelCreateModal} />
            </Modal>
            <Modal
                title="Edit User"
                visible={editModalVisible}
                onCancel={handleCancelEditModal}
                footer={null}
            >
                {userSelect && <EditUser user={userSelect} accessToken={accessToken} onDataUpdated={handleDataUpdate} onCancel={handleCancelEditModal} />}
            </Modal>
            <Modal
                title="Change Role To Admin"
                visible={changeAdminModalVisible}
                onOk={() => handleChangeAdmin()}
                onCancel={() => setChangeAdminModalVisible(false)}
                okButtonProps={{ type: "primary", className: "bg-blue-500" }}
            >
                <p>Are you sure you want to change role user to admin?</p>
            </Modal>
            <Modal
                title="Change Role To User"
                visible={changeUserModalVisible}
                onOk={() => handleChangeUser()}
                onCancel={() => setChangeUserModalVisible(false)}
                okButtonProps={{ type: "primary", className: "bg-blue-500" }}
            >
                <p>Are you sure you want to change role admin to user?</p>
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
