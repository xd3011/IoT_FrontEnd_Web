import { Card, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import deviceTypes from '../../../types/deviceTypes';
import EditDevice from "./EditDevice";
import ControlDevice from "./ControlDevice";

const { Meta } = Card;

interface Props {
    room: Room;
    accessToken: string;
    dataChanged: boolean;
    onChange: () => void;
}

const ViewDevice: React.FC<Props> = ({ room, accessToken, dataChanged, onChange }) => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<Device | undefined>(undefined);
    const [controlModal, setControlModal] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);

    const isRoomPath = usePathname().startsWith('/room/');
    const cardStyle = isRoomPath ? { flexBasis: '24%', marginBottom: '8px' } : { minWidth: '25%', marginBottom: '8px' };


    const convertToDevice = (data: any[]): Device[] => {
        return data.map(device => {
            return ({
                did: device._id,
                device_name: device.device_name,
                gateway_code: device.gateway_code,
                mac_address: device.mac_address,
                device_type: device.device_type ? deviceTypes.find(type => type.id === device.device_type) : undefined,
                rid: device.device_in_room,
                device_value: device.device_value
            })
        });
    };

    useEffect(() => {
        const fetchDevice = async () => {
            try {
                const resDevice = await fetch(`http://localhost:5000/api/device/${room.rid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken,
                    },
                });
                if (resDevice.ok) {
                    const data = await resDevice.json();
                    if (!data.devices) {
                        message.warning(data.error);
                    } else {
                        const convertedDevices = convertToDevice(data.devices);
                        setDevices(convertedDevices);
                    }
                } else {
                    const data = await resDevice.json();
                    message.error(data.error);
                }
            } catch (error) {
                console.error('Error fetching device data:', error);
            }
        }
        fetchDevice();
    }, [dataChanged, room]);

    const handleCancelEditModal = () => {
        setEditModal(false);
    };

    const handleCancelControlModal = () => {
        setControlModal(false);
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
        setDeleteModal(false);
    };

    const handleDeviceDataChange = () => {
        onChange();
    };

    return (
        <div>
            <div className="mt-3 ml-2 font-medium text-lg">
                <h2>{room.name}</h2>
            </div>
            <div className={`flex mt-4 overflow-x-auto gap-3 ${usePathname().startsWith('/room/') ? 'flex-wrap' : ''}`} style={{ gap: '12px' }}>
                {devices.map((device) => (
                    <Card
                        key={device.did}
                        style={cardStyle}
                        hoverable
                        actions={[
                            <EditOutlined key="edit" onClick={() => {
                                setSelectedDevice(device);
                                setEditModal(true);
                            }} />,
                            <DeleteOutlined key="delete" onClick={() => {
                                setSelectedDevice(device);
                                setDeleteModal(true);
                            }} />,
                            <SettingOutlined key="setting" onClick={() => {
                                console.log("123");
                            }} />,
                        ]}
                    >
                        <div onClick={() => {
                            setSelectedDevice(device);
                            setControlModal(true);
                        }}>
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                            <Meta
                                style={{ marginTop: '10px' }}
                                title={device.device_name}
                                description={device.did}
                            />
                        </div>
                    </Card>
                ))}
            </div>
            <Modal
                title="Edit Device"
                visible={editModal}
                onCancel={handleCancelEditModal}
                footer={null}
            >
                {selectedDevice && <EditDevice device={selectedDevice} accessToken={accessToken} onDataUpdated={handleDeviceDataChange} onCancel={handleCancelEditModal} />}
            </Modal>
            <Modal
                title="Control Device"
                visible={controlModal}
                onCancel={handleCancelControlModal}
                footer={null}
            >
                {selectedDevice && <ControlDevice device={selectedDevice} accessToken={accessToken} />}
                {/* onDataUpdated={handleDeviceDataChange} onCancel={handleCancelEditModal} */}
            </Modal>
            <Modal
                title="Delete Device"
                visible={deleteModal}
                onOk={() => handleDelete()}
                onCancel={() => setDeleteModal(false)}
                okButtonProps={{ type: "primary", danger: true }}
            >
                <p>Are you sure you want to delete this device?</p>
            </Modal>
        </div>
    );
}

export default ViewDevice;