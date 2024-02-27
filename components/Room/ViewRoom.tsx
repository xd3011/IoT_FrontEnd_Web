import { Avatar, Card, Modal, message } from "antd";
import { EditOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EditRoom from "./EditRoom";

const { Meta } = Card;

interface Props {
    homeSelect: string | undefined;
    accessToken: string;
    dataChange: boolean
    rooms: Room[];
    setRooms: (rooms: Room[]) => void;
    onChange: () => void;
}

const ViewRoom: React.FC<Props> = ({ homeSelect, accessToken, dataChange, onChange, rooms, setRooms }) => {
    const router = useRouter();

    const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined);
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

    useEffect(() => {
        const fetchRoom = async () => {
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
                    setRooms(data.rooms.map((e: any) => ({ rid: e._id, name: e.room_name })));
                }
                else {
                    const data = await resRoom.json();
                    message.error(data.error);
                    setRooms([]);
                }
            } catch (error) {
                console.error('Error fetching room data:', error);
            }
        };
        fetchRoom();
    }, [homeSelect, dataChange]);

    const handleCancelEditModal = () => {
        setEditModalVisible(false);
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/room/${selectedRoom?.rid}`, {
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
        setDeleteModalVisible(false);
    };

    const handleRoomDataChange = () => {
        onChange();
    };

    return (
        <div>
            <div className={`flex mt-4 overflow-x-auto gap-3`} style={{ gap: '12px' }}>
                {rooms.map((room) => (
                    <Card
                        key={room.rid}
                        style={{ minWidth: '25%', marginBottom: '8px' }}
                        hoverable
                        actions={[
                            <EditOutlined key="edit" onClick={() => {
                                setSelectedRoom(room);
                                setEditModalVisible(true);
                            }} />,
                            <DeleteOutlined key="delete" onClick={() => {
                                setSelectedRoom(room);
                                setDeleteModalVisible(true);
                            }} />,
                            <SettingOutlined key="setting" />,
                        ]}
                    >
                        <div onClick={() => {
                            router.push(`/room/${room.rid}`);
                        }}>
                            <Meta
                                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                                title={room.name}
                                description="This is the room description"
                            />
                        </div>

                    </Card>
                ))}
            </div>
            <Modal
                title="Edit Room"
                visible={editModalVisible}
                onCancel={handleCancelEditModal}
                footer={null}
            >
                {selectedRoom && <EditRoom room={selectedRoom} accessToken={accessToken} onDataUpdated={handleRoomDataChange} onCancel={handleCancelEditModal} />}
            </Modal>
            <Modal
                title="Delete Room"
                visible={deleteModalVisible}
                onOk={() => handleDelete()}
                onCancel={() => setDeleteModalVisible(false)}
                okButtonProps={{ type: "primary", danger: true }}
            >
                <p>Are you sure you want to delete room?</p>
            </Modal>
        </div>
    )
}

export default ViewRoom;
