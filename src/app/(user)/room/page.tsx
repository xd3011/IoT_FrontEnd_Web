'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import { message } from "antd";
import HomeList from "../../../../components/HomeList";

const { Meta } = Card;

interface Home {
    hid: string;
    name: string;
}

interface Room {
    rid: string;
    name: string;
}

const TheRoom: React.FC = () => {
    const router = useRouter();
    const [homeSelect, setHomeSelect] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('homeSelect') || '';
        } else {
            return '';
        }
    });
    const [homes, setHomes] = useState<Home[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    let accessToken: string;

    if (typeof localStorage !== 'undefined') {
        accessToken = localStorage.getItem('accessToken') || '';
        if (!accessToken) {
            console.error('accessToken not found');
            router.push('/login');
            return null; // Return early to prevent the rest of the code from executing
        }
        // Rest of your code for the case when accessToken is available
    } else {
        console.error('localStorage is not available');
        router.push('/login');
        return null; // Return early to prevent the rest of the code from executing
    }

    useEffect(() => {
        localStorage.setItem('homeSelect', homeSelect);
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
                        setRooms(data.rooms.map((e: any) => ({ hid: e._id, name: e.room_name })));
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
    }, [homeSelect]);

    const handleClick = () => {
        alert(123);
    }

    return (
        <div>
            <HomeList homes={homes} homeSelect={homeSelect} setHomeSelect={setHomeSelect} />
            <div className="flex flex-wrap mt-4">
                {rooms.map((room, index) => (
                    <div key={room.rid} className="w-1/4 px-2 mb-4">
                        <Card
                            actions={[
                                <SettingOutlined key="setting" onClick={handleClick} />,
                                <EditOutlined key="edit" />,
                                <EllipsisOutlined key="ellipsis" />,
                            ]}
                        >
                            <Meta
                                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                                title={room.name}
                                description="This is the room description"
                            />
                        </Card>
                    </div>
                ))}
            </div>
        </div>

    );
}

export default TheRoom;
