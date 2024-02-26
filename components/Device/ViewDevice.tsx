import { Card, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import deviceTypes from '../../types/deviceTypes';
import EditDevice from "../../components/Device/EditDevice";

const { Meta } = Card;

interface Props {
    room: Room;
    accessToken: string;
    dataChanged: boolean;
    onChange: () => void;
}

const ViewDevice: React.FC<Props> = ({ room, accessToken, dataChanged, onChange }) => {
    console.log(room);

    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<Device | undefined>(undefined);
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
    const [deleteDeviceModalVisible, setDeleteDeviceModalVisible] = useState<boolean>(false);

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
                rid: device.device_in_room
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
        setEditModalVisible(false);
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

    const handleDeviceDataChange = () => {
        onChange();
    };

    return (
        <div>
            <div className="mt-3 ml-2 font-medium text-lg">
                <h2>{room.name}</h2>
            </div>
            <div className={`flex mt-4 overflow-x-auto gap-3 ${usePathname().startsWith('/room/') ? 'flex-wrap' : ''}`}>
                {devices.map((device) => (
                    <Card
                        key={device.did}
                        style={cardStyle}
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        hoverable
                        actions={[
                            <EditOutlined key="edit" onClick={() => {
                                setSelectedDevice(device);
                                setEditModalVisible(true);
                            }} />,
                            <DeleteOutlined key="delete" onClick={() => {
                                setSelectedDevice(device);
                                setDeleteDeviceModalVisible(true);
                            }} />,
                            <SettingOutlined key="setting" onClick={() => {
                                console.log("123");
                            }} />,
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
    );
}

export default ViewDevice;