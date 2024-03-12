import React, { useEffect, useState } from 'react';
import { Button, message, Checkbox } from 'antd';
import deviceTypes from '../../../types/deviceTypes';
import { List, Avatar } from 'antd';

interface Props {
    rid: string;
    hid: string;
    accessToken: string;
    onAdd: () => void;
    onCancel: () => void;
}

const AddDeviceInRoom: React.FC<Props> = ({ rid, hid, accessToken, onAdd, onCancel }) => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [checkedDevices, setCheckedDevices] = useState<string[]>([]);
    const [checkAll, setCheckAll] = useState(false);

    const convertToDevice = (data: any[]): Device[] => {
        return data
            .filter(device => !device.device_in_room)
            .map(device => ({
                did: device._id,
                device_name: device.device_name,
                gateway_code: device.gateway_code,
                mac_address: device.mac_address,
                device_type: deviceTypes.deviceTypes.find(type => type.id === device.device_type),
                hid: device.device_in_home,
                rid: device.device_in_room,
                device_data: device.device_data
            }));
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
    }, [hid])

    const handleCheckAll = (e: any) => {
        setCheckedDevices(e.target.checked ? devices.map(device => device.did) : []);
        setCheckAll(e.target.checked);
    };

    const handleCheckboxChange = (deviceID: string) => {
        const currentIndex = checkedDevices.indexOf(deviceID);
        const newCheckedDevices = [...checkedDevices];

        if (currentIndex === -1) {
            newCheckedDevices.push(deviceID);
        } else {
            newCheckedDevices.splice(currentIndex, 1);
        }

        setCheckedDevices(newCheckedDevices);
        setCheckAll(newCheckedDevices.length === devices.length);
    };

    const handleAdd = async () => {
        const selectedDevices = devices.filter(device => checkedDevices.includes(device.did));
        try {
            const changeRoomRequests = selectedDevices.map(async device => {
                try {
                    const changeRoomDevice = await fetch(`http://localhost:5000/api/device/changeRoomDevice/${device.did}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': accessToken,
                        },
                        body: JSON.stringify({ rid: rid })
                    });
                    if (changeRoomDevice.ok) {
                        const data = await changeRoomDevice.json();
                        if (!data.message) {
                            message.warning(data.error);
                        } else {
                            message.success(data.message);
                            setDevices(prevDevices => prevDevices.filter(prevDevice => prevDevice.did !== device.did));
                            onAdd();
                            onCancel();
                        }
                    } else {
                        const data = await changeRoomDevice.json();
                        message.error(data.error);
                    }
                } catch (error) {
                    console.error('Error fetching device data:', error);
                }
            });

            // Wait for all requests to complete
            await Promise.all(changeRoomRequests);
        } catch (error) {
            console.error('Error handling add:', error);
        }
        console.log(selectedDevices);
    }

    return (
        <div>
            <Checkbox checked={checkAll} onChange={handleCheckAll}>Check All</Checkbox>
            <List
                itemLayout="horizontal"
                dataSource={devices}
                renderItem={(device, index) => (
                    <List.Item>
                        <Checkbox
                            checked={checkedDevices.includes(device.did)}
                            onChange={() => handleCheckboxChange(device.did)}
                            className='mr-2'
                            disabled={!devices || devices.length === 0}
                        />
                        <List.Item.Meta
                            avatar={<Avatar src={device.device_type?.image} />}
                            title={device.device_name}
                            description={device.mac_address}
                        />
                    </List.Item>
                )}
            />
            <div className='flex justify-end'>
                <Button type="primary" className="ml-2 bg-blue-500" onClick={handleAdd}>Add Device</Button>
            </div>
        </div>
    );
};

export default AddDeviceInRoom;
