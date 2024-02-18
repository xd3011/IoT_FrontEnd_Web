'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Card, Modal, Button, message, Form, Input } from 'antd';
import { EditOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import CreateHome from "../../../../components/Home/CreateHome";
import EditHome from "../../../../components/Home/EditHome";

const { Meta } = Card;

interface Home {
    hid: string;
    name: string;
    address: string;
}

const TheHome: React.FC = () => {
    const router = useRouter();

    const [homes, setHomes] = useState<Home[]>([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
    const [selectedHomeId, setSelectedHomeId] = useState<string>("");
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
    const [homeDataChanged, setHomeDataChanged] = useState<boolean>(false);
    const [selectedHome, setSelectedHome] = useState<Home | null>(null);

    let accessToken: string;

    if (typeof localStorage !== "undefined") {
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
                    }
                    else {
                        setHomes(data.homes.map((e: any) => ({ hid: e._id, name: e.home_name, address: e.address })));
                    }
                }
                else {
                    const data = await resHome.json();
                    message.error(data.error);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [accessToken, homeDataChanged]);

    const handleDelete = async (hid: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/home/${hid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
            });
            if (res.ok) {
                setHomes(homes.filter(home => home.hid !== hid));
                message.success('Home deleted successfully.');
            } else {
                const data = await res.json();
                message.error(data.error);
            }
        } catch (error) {
            console.error('Error deleting home:', error);
        }
        setDeleteModalVisible(false);
    };

    const handleCreateModal = () => {
        setCreateModalVisible(true);
    };

    const handleEditModal = (home: Home) => {
        setSelectedHome(home);
        setEditModalVisible(true);
    };

    const handleCancelCreateModal = () => {
        setCreateModalVisible(false);
    };

    const handleCancelEditModal = () => {
        setEditModalVisible(false);
    };

    const handleHomeDataChange = () => {
        setHomeDataChanged(prev => !prev);
    };

    const handleMetaClick = (hid: string) => {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem('homeSelect', hid);
            router.push('/room');
        }
    };

    return (
        <div>
            <Button type="primary" className="ml-2 bg-blue-500 font-bold py-2 px-4 rounded pb-8" onClick={handleCreateModal}>
                Create Home
            </Button>
            <div className={`flex flex-wrap mt-4 ${homes.length > 4 ? 'overflow-x-auto' : ''}`}>
                {homes.map((home, index) => (
                    <div key={home.hid} className="w-1/4 px-2 mb-4">
                        <Card
                            actions={[
                                <EditOutlined key="edit" onClick={() => handleEditModal(home)} />,
                                <DeleteOutlined key="delete" onClick={() => {
                                    setSelectedHomeId(home.hid);
                                    setDeleteModalVisible(true);
                                }} />,
                                <SettingOutlined key="setting" />,
                            ]}
                            hoverable
                        >
                            <div onClick={() => handleMetaClick(home.hid)}>
                                <Meta
                                    avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                                    title={home.name}
                                    description={home.address}
                                />
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
            <Modal
                title="Delete Home"
                visible={deleteModalVisible}
                onOk={() => handleDelete(selectedHomeId)}
                onCancel={() => setDeleteModalVisible(false)}
                okButtonProps={{ type: "primary", danger: true }}
            >
                <p>Are you sure you want to delete this home?</p>
            </Modal>
            <Modal
                title="Create Home"
                visible={createModalVisible}
                onCancel={handleCancelCreateModal}
                footer={null}
            >
                <CreateHome accessToken={accessToken} onCreate={handleHomeDataChange} onCancel={handleCancelCreateModal} />
            </Modal>
            <Modal
                title="Edit Home"
                visible={editModalVisible}
                onCancel={handleCancelEditModal}
                footer={null}
            >
                {selectedHome && <EditHome home={selectedHome} accessToken={accessToken} onDataUpdated={handleHomeDataChange} onCancel={handleCancelEditModal} />}
            </Modal>
        </div>
    );
}

export default TheHome;