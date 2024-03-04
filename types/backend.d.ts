interface Home {
    hid: string;
    name: string;
    address: string;
}

interface Room {
    rid: string;
    name: string;
}

interface User {
    uid: string;
    name: string;
    age: number;
    gender: string;
    address: string;
    phone: string;
    email: string;
    roll: string;
}

interface Device {
    did: string;
    device_name: string;
    gateway_code: string;
    mac_address: string;
    device_type: DeviceType | undefined;
    rid: string;
    device_data: DeviceData;
}

interface DeviceType {
    id: number;
    name: string;
    image: string;
}

interface DeviceData {
    value: number | undefined;
}
