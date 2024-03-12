'use client'
import { Button, Modal, message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ViewDevice from "../../../../components/Device/ViewDevice";
import AddDeviceInRoom from "../../../../components/Room/AddDeviceInRoom";

const TheRoomPage: React.FC = (props: any) => {
    const router = useRouter();

    const [room, setRoom] = useState<Room>()
    const [deviceDataChanged, setDeviceDataChanged] = useState<boolean>(false);
    const [addModalVisible, setAddModalVisible] = useState<boolean>(false);

    const rid = props.params.rid;
    let homeSelect;
    let accessToken: string;
    if (typeof localStorage !== 'undefined') {
        accessToken = localStorage.getItem('accessToken') || '';
        homeSelect = localStorage.getItem('homeSelect') || '';
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

    const handleAddModal = () => {
        setAddModalVisible(true);
    };

    const handleCancelAddModal = () => {
        setAddModalVisible(false);
    };

    return (
        <div>
            <h2>{room?.name}</h2>
            <Button type="primary" className="ml-2 bg-blue-500 font-bold py-2 px-4 rounded pb-8" onClick={handleAddModal}>
                Add Device In Room
            </Button>
            {room && <ViewDevice rid={rid} hid={homeSelect} accessToken={accessToken} dataChanged={deviceDataChanged} onChange={handleDeviceDataChange}></ViewDevice>}
            <Modal
                title="Add Device In Room"
                visible={addModalVisible}
                onCancel={handleCancelAddModal}
                footer={null}
                className="min-h-max"

            >
                <AddDeviceInRoom rid={rid} hid={homeSelect} accessToken={accessToken} onAdd={handleDeviceDataChange} onCancel={handleCancelAddModal} />
            </Modal>
        </div>
    )
}

export default TheRoomPage