import { Switch, message } from "antd"
import { useEffect, useState } from "react";
import deviceTypes from '../../../types/deviceTypes';

interface Props {
    device: Device;
    accessToken: string;
}

const ControlLightDevice: React.FC<Props> = ({ device, accessToken }) => {
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<DeviceType>();
    const [value, setValue] = useState<DeviceData>();
    const [switchState, setSwitchState] = useState<boolean>();

    useEffect(() => {
        setName(device.device_name);
        setType(device.device_type);
        setValue(device.device_data);
        setSwitchState(device.device_data?.value ? true : false);
    }, [device])

    const handleSwitchChange = async () => {
        try {
            const newValueId = switchState ? 0 : 1;
            const res = await fetch(`http://localhost:5000/api/device/${device.did}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ value: newValueId }),
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.error) {
                    message.success(data.message);
                    setValue({ value: newValueId });
                    setSwitchState(!switchState);
                } else {
                    message.error(data.error);
                }
            }
        } catch (error) {
            console.error('Error updating device:', error);
        }
    }

    const getDeviceValue = (id: number | undefined): string => {
        const deviceValueObj = deviceTypes.deviceLightValue.find(value => value.id === id);
        return deviceValueObj ? deviceValueObj.name : '';
    };

    return (
        <div className="flex flex-col items-start h-full">
            <h2 className="text-xl font-semibold mb-2">{name}</h2>
            <h3 className="text-lg mb-2">{type?.name}</h3>
            <h3 className="text-lg mb-4">{getDeviceValue(value?.value)}</h3>
            <div style={{ textAlign: 'center', margin: '0 auto' }}>
                <Switch
                    style={{
                        transform: 'scale(1.75)',
                        backgroundColor: switchState ? '' : '#8c8c8c'
                    }}
                    checked={switchState}
                    onChange={handleSwitchChange}
                    checkedChildren="ON"
                    unCheckedChildren="OFF"
                />
            </div>
        </div>
    );
}

export default ControlLightDevice