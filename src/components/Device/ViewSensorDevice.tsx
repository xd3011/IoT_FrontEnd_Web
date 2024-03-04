import { Switch, message } from "antd"
import { useEffect, useState } from "react";
import deviceTypes from '../../../types/deviceTypes';

interface Props {
    device: Device;
    accessToken: string;
}

const ViewSensorDevice: React.FC<Props> = ({ device, accessToken }) => {
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<DeviceType>();
    const [value, setValue] = useState<DeviceData>();

    useEffect(() => {
        setName(device.device_name);
        setType(device.device_type);
        setValue(device.device_data);
    }, [device])

    const getDeviceValue = (id: number | undefined): string => {
        const deviceValueObj = deviceTypes.deviceLightValue.find(value => value.id === id);
        return deviceValueObj ? deviceValueObj.name : '';
    };

    return (
        <div className="flex flex-col items-start h-full">
            <h2 className="text-xl font-semibold mb-2">{name}</h2>
            <h3 className="text-lg mb-2">{type?.name}</h3>
            <h3 className="text-lg mb-4">{getDeviceValue(value?.value)}</h3>
        </div>
    );
}

export default ViewSensorDevice