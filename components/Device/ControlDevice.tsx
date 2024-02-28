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

    const [switchState, setSwitchState] = useState(true);

    const handleSwitchChange = () => {
        setSwitchState(!switchState);
        if (switchState) {
            console.log("Switch is OFF", switchState);
        } else {
            console.log("Switch is ON", switchState);
        }
    };

    return (
        <div className="flex flex-col items-start h-full">
            <h2 className="text-xl font-semibold mb-2">{name}</h2>
            <h3 className="text-lg mb-2">{type?.name}</h3>
            <h3 className="text-lg mb-4">{value?.value}</h3>
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

export default ControlDevice