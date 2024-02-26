'use client'
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ViewDevice from "../../../../../components/Device/ViewDevice";

const TheRoomPage: React.FC = (props: any) => {
    const router = useRouter();

    const [room, setRoom] = useState<Room>()
    const [deviceDataChanged, setDeviceDataChanged] = useState<boolean>(false);

    const rid = props.params.rid;

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
        const fetchRoomDetail = async () => {
            try {
                const resRoom = await fetch(`http://localhost:5000/api/room/getDetail/${rid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken,
                    }
                });
                if (resRoom.ok) {
                    const data = await resRoom.json();
                    setRoom({
                        rid: data.room._id,
                        name: data.room.room_name
                    });
                }
                else {
                    const data = await resRoom.json();
                    message.error(data.error);
                }
            } catch (error) {
                console.error('Error fetching room data:', error);
            }
        };
        fetchRoomDetail();
    }, []);

    const handleDeviceDataChange = () => {
        setDeviceDataChanged(prev => !prev);
    };

    return (
        <div>
            {room && <ViewDevice room={room} accessToken={accessToken} dataChanged={deviceDataChanged} onChange={handleDeviceDataChange}></ViewDevice>}
        </div>
    )
}

export default TheRoomPage