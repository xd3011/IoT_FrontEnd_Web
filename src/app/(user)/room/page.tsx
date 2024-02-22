'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { EditOutlined, SettingOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Modal, Button, message } from 'antd';
import HomeList from "../../../../components/HomeList";
import UserInHome from "../../../../components/Home/UserInHome";
import EditRoom from "../../../../components/Room/EditRoom";
import CreateRoom from "../../../../components/Room/CreateRoom";

interface Home {
    hid: string;
    name: string;
}

interface Room {
    rid: string;
    name: string;
}

const { Meta } = Card;

const TheRoom: React.FC = () => {
    const router = useRouter();
    const [homeSelect, setHomeSelect] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const storedHomeSelect = localStorage.getItem('homeSelect');
            return storedHomeSelect || '';
        }
        return '';
    });
    const [homes, setHomes] = useState<Home[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [roomDataChanged, setRoomDataChanged] = useState<boolean>(false);
    const [modalAction, setModalAction] = useState<'edit' | 'create'>('edit');
    const [selectedRoomId, setSelectedRoomId] = useState<string>("");
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);
    const [isUserInHomeVisible, setIsUserInHomeVisible] = useState<boolean>(false);
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
        if (homeSelect !== '') {
            localStorage.setItem('homeSelect', homeSelect);
        }
    }, [homeSelect]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resHome = await fetch('http://localhost:5000/api/home', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken,
                    },
                });
                if (resHome.ok) {
                    const data = await resHome.json();
                    if (!data.homes) {
                        message.warning(data.message);
                    } else {
                        setHomes(data.homes.map((e: any) => ({ hid: e._id, name: e.home_name })));
                        if (homeSelect == '') {
                            const firstHome = data.homes[0];
                            setHomeSelect(firstHome._id);
                        }
                    }
                } else {
                    const data = await resHome.json();
                    message.error(data.error);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [accessToken]);

    useEffect(() => {
        const fetchData = async () => {
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
        fetchData();
    }, [homeSelect, roomDataChanged]);

    const showModal = (action: 'edit' | 'create', room?: Room) => {
        setModalAction(action);
        setSelectedRoom(room || null);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setSelectedRoom(null);
        setIsModalVisible(false);
    };

    const handleRoomDataChange = () => {
        setRoomDataChanged(prev => !prev);
    };

    const handleDeleteRoom = (rid: string) => {
        setSelectedRoomId(rid);
        setIsDeleteModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/room/${selectedRoomId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
            });
            if (res.ok) {
                const data = await res.json();
                message.success(data.message);
                handleRoomDataChange();
            } else {
                const data = await res.json();
                message.error(data.error);
            }
        } catch (error) {
            console.error('Error deleting room:', error);
        }
        setIsDeleteModalVisible(false);
    };

    const handleCancelDelete = () => {
        setSelectedRoomId("");
        setIsDeleteModalVisible(false);
    };

    const showUserInHomePopup = () => {
        setIsUserInHomeVisible(true);
    };

    const closeUserInHomePopup = () => {
        setIsUserInHomeVisible(false);
    };

    return (
        <div>
            <div className="flex items-start justify-between">
                <div className="flex flex-row items-start">
                    <HomeList homes={homes} homeSelect={homeSelect} setHomeSelect={setHomeSelect} />
                    <Button onClick={showUserInHomePopup} type="primary" className="bg-blue-500 font-bold py-2 px-4 pb-8 ml-4 h-10 mt-2" icon={<UserOutlined />}>
                        User in home
                    </Button>
                </div>
                <Button onClick={() => showModal('create')} type="primary" className="bg-blue-500 font-bold py-2 px-4 pb-8 mt-2">
                    Create Room
                </Button>
            </div>
            <div className={`flex mt-4 overflow-x-auto gap-3`}>
                {rooms.map((room, index) => (
                    <Card
                        key={room.rid}
                        style={{ minWidth: '25%', marginBottom: '8px' }}
                        hoverable
                        actions={[
                            <EditOutlined key="edit" onClick={() => showModal('edit', room)} />,
                            <DeleteOutlined key="delete" onClick={() => handleDeleteRoom(room.rid)} />,
                            <SettingOutlined key="setting" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                            title={room.name}
                            description="This is the room description"
                        />
                    </Card>
                ))}
            </div>
            <Modal title="Delete Room" visible={isDeleteModalVisible} onOk={handleConfirmDelete} onCancel={handleCancelDelete} okButtonProps={{ type: "primary", danger: true }}>
                <p>Are you sure you want to delete this room?</p>
            </Modal>
            <Modal title={modalAction === 'edit' ? 'Edit Room' : 'Create Room'} visible={isModalVisible} onCancel={handleCancel} footer={null}>
                {modalAction === 'edit' && selectedRoom && (
                    <EditRoom room={selectedRoom} onCancel={handleCancel} accessToken={accessToken} onDataUpdated={handleRoomDataChange} />
                )}
                {modalAction === 'create' && (
                    <CreateRoom accessToken={accessToken} onCancel={handleCancel} onCreate={handleRoomDataChange} homeSelect={homeSelect} />
                )}
            </Modal>
            <Modal className='flex justify-center min-w-max' title="User in Home" visible={isUserInHomeVisible} onCancel={closeUserInHomePopup} footer={null}>
                {homeSelect && <UserInHome homeSelect={homeSelect} accessToken={accessToken} />}
            </Modal>
        </div>
    );
}

export default TheRoom;
