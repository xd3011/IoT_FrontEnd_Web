import { Card, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import deviceTypes from '../../../types/deviceTypes';
import EditDevice from "./EditDevice";
import ChangeRoomDevice from "../Room/ChangeRoomDevice";
import ControlLightDevice from "./ControlLightDevice";
import ViewSensorDevice from "./ViewSensorDevice";

const { Meta } = Card;

interface Props {
    hid: string;
    accessToken: string;
    dataChanged: boolean;
    onChange: () => void;
    rid?: string;
    rooms?: Room[];
}

const ViewDevice: React.FC<Props> = ({ hid, accessToken, dataChanged, onChange, rid, rooms }) => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<Device>();
    const [controlModal, setControlModal] = useState<boolean>(false);
    const [viewSensorDevice, setViewSensorDevice] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [changeRoomDevice, setChangeRoomDevice] = useState<boolean>(false);
    const [changeRoomModal, setChangeRoomModal] = useState<boolean>(false);

    const isRoomPath = usePathname().startsWith('/room/');
    const cardStyle = isRoomPath ? { flexBasis: '24%', marginBottom: '8px' } : { minWidth: '25%', marginBottom: '8px' };

    const convertToDevice = (data: any[]): Device[] => {
        const devices: Device[] = [];
        data.forEach(device => {
            if (rid !== undefined && device.device_in_room === rid) {
                devices.push({
                    did: device._id,
                    device_name: device.device_name,
                    gateway_code: device.gateway_code,
                    mac_address: device.mac_address,
                    device_type: deviceTypes.deviceTypes.find(type => type.id === device.device_type),
                    hid: device.device_in_home,
                    rid: device.device_in_room,
                    device_data: device.device_data
                });
            } else if (rid === undefined) {
                devices.push({
                    did: device._id,
                    device_name: device.device_name,
                    gateway_code: device.gateway_code,
                    mac_address: device.mac_address,
                    device_type: deviceTypes.deviceTypes.find(type => type.id === device.device_type),
                    hid: device.device_in_home,
                    rid: device.device_in_room,
                    device_data: device.device_data
                });
            }
        });
        return devices;
    };

    useEffect(() => {
        const fetchDevice = async () => {
            try {
                const resDevice = await fetch(`http://localhost:5000/api/device/${hid}`, {
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
    }, [dataChanged, hid]);

    const handleCancelEditModal = () => {
        setEditModal(false);
    };

    const handleCancelChangeModal = () => {
        setChangeRoomDevice(false);
    };

    const handleCancelControlModal = () => {
        setControlModal(false);
    };

    const handleCancelViewSensor = () => {
        setViewSensorDevice(false);
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

    const handleChangeRoomDevice = (device: Device, rid: string) => {
        const deviceIndex = devices.findIndex((item) => item.did === device.did);
        if (deviceIndex !== -1) {
            const updatedDevices = [...devices];
            updatedDevices[deviceIndex].rid = rid;
            setDevices(updatedDevices);
        }
    }

    return (
        <div>
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
                                if (rid) {
                                    setChangeRoomModal(true);
                                }
                                else {
                                    setSelectedDevice(device);
                                    setChangeRoomDevice(true);
                                }
                            }} />,
                        ]}
                    >
                        <div onClick={() => {
                            setSelectedDevice(device);
                            if (device.device_type?.id === 0) {
                                setControlModal(true);
                            }
                            if (device.device_type?.id === 1) {
                                setViewSensorDevice(true);
                            }
                        }}>
                            <img
                                className="w-full"
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                            <Meta
                                style={{ marginTop: '10px' }}
                                title={device.device_name}
                                description={device.device_type?.name}
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
                title="Change Room For Device"
                visible={changeRoomDevice}
                onCancel={handleCancelChangeModal}
                footer={null}
            >
                {selectedDevice && <ChangeRoomDevice device={selectedDevice} rooms={rooms} accessToken={accessToken} onDataUpdated={handleChangeRoomDevice} onCancel={handleCancelChangeModal} />}
            </Modal>
            <Modal
                title="Control Device"
                visible={controlModal}
                onCancel={handleCancelControlModal}
                footer={null}
            >
                {selectedDevice && <ControlLightDevice device={selectedDevice} accessToken={accessToken} />}
            </Modal>
            <Modal
                title="View Sensor Device"
                visible={viewSensorDevice}
                onCancel={handleCancelViewSensor}
                footer={null}
            >
                {selectedDevice && <ViewSensorDevice device={selectedDevice} accessToken={accessToken} />}
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