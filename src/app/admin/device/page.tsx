'use client'

import { Button, Modal, Space, Table, TableProps, message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import CreateDeviceType from "@/components/DeviceType/CreateDeviceType";
import EditDeviceType from "@/components/DeviceType/EditDeviceType";

const App: React.FC = () => {
    const router = useRouter();
    const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
    const [reload, setReload] = useState<boolean>(false);
    const [deviceTypeSelect, setDeviceTypeSelect] = useState<DeviceType>();

    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
    const [createDeviceType, setCreateDeviceType] = useState<boolean>(false);
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

    const columns: TableProps<DeviceType>['columns'] = [
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
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button danger onClick={() => {
                        setDeviceTypeSelect(record);
                        setEditModalVisible(true);
                    }} icon={<EditOutlined />} />
                    <Button danger onClick={() => {
                        setDeviceTypeSelect(record);
                        setDeleteModalVisible(true);
                    }} icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    const fetchDeviceType = async () => {
        try {
            const resDeviceTypes = await fetch(`http://localhost:5000/api/deviceType/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                }
            })
            if (resDeviceTypes.ok) {
                const data = await resDeviceTypes.json();
                if (!data.deviceTypes) {
                    message.error(data.error);
                } else {
                    const mappedDeviceTypes: DeviceType[] = data.deviceTypes.map((deviceType: any, index: number) => {
                        return {
                            dtid: deviceType._id,
                            name: deviceType.name,
                            image: deviceType.image,
                            type: deviceType.type,
                            index: index + 1,
                        };
                    });
                    await setDeviceTypes(mappedDeviceTypes);
                }
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    useEffect(() => {
        fetchDeviceType();
    }, [reload]);

    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/deviceType/${deviceTypeSelect?.dtid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
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

    const handleDeviceType = () => {
        setCreateDeviceType(true);
    };

    const handleCancelCreateModal = () => {
        setCreateDeviceType(false);
    }

    return (
        <div>
            <div className="flex items-center">
                <Button onClick={handleDeviceType} type="primary" className="bg-blue-500 font-bold py-2 px-4 pb-8 ml-4 h-10 mt-2 mb-2" icon={<AppstoreAddOutlined />}>
                    Create Device Type
                </Button>
            </div>
            <Table columns={columns} dataSource={deviceTypes} pagination={pagination}
                onChange={handleTableChange} />
            <Modal
                title="Create Device Type"
                visible={createDeviceType}
                onCancel={handleCancelCreateModal}
                footer={null}
            >
                <CreateDeviceType accessToken={accessToken} onDataCreated={handleDataUpdate} onCancel={handleCancelCreateModal} />
            </Modal>
            <Modal
                title="Edit Device Type"
                visible={editModalVisible}
                onCancel={handleCancelEditModal}
                footer={null}
            >
                {deviceTypeSelect && <EditDeviceType deviceType={deviceTypeSelect} accessToken={accessToken} onDataUpdated={handleDataUpdate} onCancel={handleCancelEditModal} />}
            </Modal>
            <Modal
                title="Delete Device Type"
                visible={deleteModalVisible}
                onOk={() => handleDelete()}
                onCancel={() => setDeleteModalVisible(false)}
                okButtonProps={{ type: "primary", danger: true }}
            >
                <p>Are you sure you want to delete device type?</p>
            </Modal>
        </div>
    )
}

export default App;
