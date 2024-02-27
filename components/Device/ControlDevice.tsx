import { Switch } from "antd"
import { useEffect, useState } from "react";

interface Props {
    device: Device;
    accessToken: string;
}

const ControlDevice: React.FC<Props> = ({ device, accessToken }) => {
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<DeviceType>();
    const [value, setValue] = useState<DeviceValue>();

    useEffect(() => {
        setName(device.device_name);
        setType(device.device_type);
        setValue(device.device_value);
    }, [])

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-xl font-semibold mb-2">{name}</h2>
            <h3 className="text-lg mb-2">{type?.name}</h3>
            <h3 className="text-lg mb-4">{value?.value}</h3>
            <Switch
                checkedChildren="ON"
                unCheckedChildren="OFF"
                defaultChecked
                className='scale-[5]'
            />
        </div>
    );
}

export default ControlDevice