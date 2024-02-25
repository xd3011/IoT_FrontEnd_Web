'use client'
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card, Modal, Button, message } from 'antd';
import CreateDevice from "../../../../components/Device/CreateDevice";
import deviceTypes from '../../../../types/deviceTypes';
import EditDevice from "../../../../components/Device/EditDevice";

const { Meta } = Card;

const TheDevice: React.FC = () => {
    const router = useRouter();

    const [homeSelect, setHomeSelect] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const storedHomeSelect = localStorage.getItem('homeSelect');
            return storedHomeSelect || '';
        }
        return '';
    });

    const [rooms, setRooms] = useState<Room[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);

    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
    const [selectedDevice, setSelectedDevice] = useState<Device | undefined>(undefined);
    const [deviceDataChanged, setDeviceDataChanged] = useState<boolean>(false);
    const [deleteDeviceModalVisible, setDeleteDeviceModalVisible] = useState<boolean>(false);

    let accessToken: string;
    if (typeof localStorage !== 'undefined') {
        accessToken = localStorage.getItem('accessToken') || '';
        if (!accessToken) {
            console.error('accessToken not found');
            router.push('/login');
            return null;
        }
    } else {
        console.error('localStorage is not available');
        router.push('/login');
        return null;
    }
    useEffect(() => {
        const fetchHome = async () => {
            try {
                const resRoom = await fetch(`http://localhost:5000/api/room/${homeSelect}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken,
                    }
                });
                if (resRoom.ok) {
                    const data = await resRoom.json();
                    if (!data.rooms) {
                        message.warning(data.error);
                    }
                    else {
                        setRooms(data.rooms.map((e: any) => ({ rid: e._id, name: e.room_name })));
                    }
                }
                else {
                    const data = await resRoom.json();
                    message.error(data.error);
                }
            } catch (error) {
                console.error('Error fetching room data:', error);
            }
        };
        fetchHome();
    }, [homeSelect, accessToken]);

    useEffect(() => {
        const fetchDevice = async () => {
            try {
                const devicePromises = rooms.map(async (room) => {
                    const resDevice = await fetch(`http://localhost:5000/api/device/${room.rid}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': accessToken,
                        },
                    });
                    if (resDevice.ok) {
                        const data = await resDevice.json();
                        return data.devices;
                    } else {
                        const data = await resDevice.json();
                        message.error(data.error);
                        return [];
                    }
                });
                const devicesInAllRooms = await Promise.all(devicePromises);
                const allDevices = devicesInAllRooms.flat();
                const convertedDevices = convertToDevice(allDevices);
                setDevices(convertedDevices);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchDevice();
    }, [homeSelect, rooms, deviceDataChanged]);

    const convertToDevice = (data: any[]): Device[] => {
        return data.map(device => {
            return ({
                did: device._id,
                device_name: device.device_name,
                gateway_code: device.gateway_code,
                mac_address: device.mac_address,
                device_type: device.device_type ? deviceTypes.find(type => type.id === device.device_type) : undefined,
                rid: device.device_in_room
            })
        });
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/device/${selectedDevice?.did}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
            });
            if (res.ok) {
                setDevices(devices.filter(device => device.did !== selectedDevice?.did));
                message.success('Device deleted successfully.');
            } else {
                const data = await res.json();
                message.error(data.error);
            }
        } catch (error) {
            console.error('Error deleting device:', error);
        }
        setDeleteDeviceModalVisible(false);
    };

    const handleSetting = (device: Device) => {
        console.log(device);
    }

    const handleEdit = (device: Device) => {
        setSelectedDevice(device);
        setEditModalVisible(true);
    }

    const handleCreateModal = () => {
        setCreateModalVisible(true);
    };

    const handleCancelCreateModal = () => {
        setCreateModalVisible(false);
    };

    const handleDeviceDataChange = () => {
        setDeviceDataChanged(prev => !prev);
    };

    const handleCancelEditModal = () => {
        setEditModalVisible(false);
    };

    return (
        <div>
            <Button type="primary" className="ml-2 bg-blue-500 font-bold py-2 px-4 rounded pb-8" onClick={handleCreateModal}>
                Create Device
            </Button>
            <div className={`flex flex-wrap gap-3 mt-4 `}>
                {devices.map((device) => (
                    <Card
                        key={device.did}
                        style={{ flexBasis: '24%', marginBottom: '8px' }}
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        hoverable
                        actions={[
                            <EditOutlined key="edit" onClick={() => handleEdit(device)} />,
                            <DeleteOutlined key="delete" onClick={() => {
                                setSelectedDevice(device);
                                setDeleteDeviceModalVisible(true);
                            }} />,
                            <SettingOutlined key="setting" onClick={() => handleSetting(device)} />,
                        ]}
                    >
                        <Meta
                            title={device.device_name}
                            description={device.did}
                        />
                    </Card>
                ))}
            </div>
            <Modal
                title="Create Device"
                visible={createModalVisible}
                onCancel={handleCancelCreateModal}
                footer={null}
            >
                <CreateDevice rooms={rooms} accessToken={accessToken} onCreate={handleDeviceDataChange} onCancel={handleCancelCreateModal} />
            </Modal>
            <Modal
                title="Edit Device"
                visible={editModalVisible}
                onCancel={handleCancelEditModal}
                footer={null}
            >
                {selectedDevice && <EditDevice device={selectedDevice} accessToken={accessToken} onDataUpdated={handleDeviceDataChange} onCancel={handleCancelEditModal} />}
            </Modal>
            <Modal
                title="Delete Device"
                visible={deleteDeviceModalVisible}
                onOk={() => handleDelete()}
                onCancel={() => setDeleteDeviceModalVisible(false)}
                okButtonProps={{ type: "primary", danger: true }}
            >
                <p>Are you sure you want to delete this device?</p>
            </Modal>
        </div>
    )
};

export default TheDevice;