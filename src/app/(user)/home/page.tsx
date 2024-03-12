'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { UserOutlined } from '@ant-design/icons';
import { Modal, Button, message } from 'antd';
import HomeList from "../../../components/HomeList";
import UserInHome from "../../../components/Home/UserInHome";
import ViewRoom from "../../../components/Room/ViewRoom";
import CreateRoom from "../../../components/Room/CreateRoom";
import TheDevice from '../../../components/Device/TheDevice';

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
    const [roomDataChanged, setRoomDataChanged] = useState<boolean>(false);
    const [isUserInHomeVisible, setIsUserInHomeVisible] = useState<boolean>(false);
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

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
    }, []);

    const handleCreateModal = () => {
        setCreateModalVisible(true);
    };

    const handleCancelCreateModal = () => {
        setCreateModalVisible(false);
    };

    const showUserInHomePopup = () => {
        setIsUserInHomeVisible(true);
    };

    const closeUserInHomePopup = () => {
        setIsUserInHomeVisible(false);
    };

    const handleRoomDataChange = () => {
        setRoomDataChanged(prev => !prev);
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
                <Button onClick={handleCreateModal} type="primary" className="bg-blue-500 font-bold py-2 px-4 pb-8 mt-2">
                    Create Room
                </Button>
            </div>
            <ViewRoom homeSelect={homeSelect} accessToken={accessToken} dataChange={roomDataChanged} onChange={handleRoomDataChange} rooms={rooms} setRooms={setRooms}></ViewRoom>
            <TheDevice hid={homeSelect} accessToken={accessToken} rooms={rooms}></TheDevice>
            <Modal
                title="Create Room"
                visible={createModalVisible}
                onCancel={handleCancelCreateModal}
                footer={null}
            >
                <CreateRoom homeSelect={homeSelect} accessToken={accessToken} onCreate={handleRoomDataChange} onCancel={handleCancelCreateModal} />
            </Modal>
            <Modal className='flex justify-center min-w-max' title="User in Home" visible={isUserInHomeVisible} onCancel={closeUserInHomePopup} footer={null}>
                {homeSelect && <UserInHome homeSelect={homeSelect} accessToken={accessToken} />}
            </Modal>
        </div>
    );
}

export default TheRoom;
