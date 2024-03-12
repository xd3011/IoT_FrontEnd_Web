'use client'
import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import CreateDevice from "./CreateDevice";
import ViewDevice from "./ViewDevice";

interface Props {
    hid: string;
    accessToken: string;
}

const TheDevice: React.FC<Props> = ({ hid, accessToken }) => {
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
    const [deviceDataChanged, setDeviceDataChanged] = useState<boolean>(false);

    const handleCreateModal = () => {
        setCreateModalVisible(true);
    };

    const handleCancelCreateModal = () => {
        setCreateModalVisible(false);
    };

    const handleDeviceDataChange = () => {
        setDeviceDataChanged(prev => !prev);
    };

    return (
        <div>
            <Button type="primary" className="ml-2 bg-blue-500 font-bold py-2 px-4 rounded pb-8" onClick={handleCreateModal}>
                Create Device
            </Button>
            <ViewDevice hid={hid} accessToken={accessToken} dataChanged={deviceDataChanged} onChange={handleDeviceDataChange} />
            <Modal
                title="Create Device"
                visible={createModalVisible}
                onCancel={handleCancelCreateModal}
                footer={null}
            >
                <CreateDevice hid={hid} accessToken={accessToken} onCreate={handleDeviceDataChange} onCancel={handleCancelCreateModal} />
            </Modal>
        </div>
    )
};

export default TheDevice;