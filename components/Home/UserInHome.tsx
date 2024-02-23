import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { message, Button, Modal } from 'antd';
import AddUser from './AddUser';


interface UserInHomeProps {
    homeSelect: string;
    accessToken: string;
}

interface User {
    id: number;
    name: string;
    age: number;
    gender: string;
    address: string;
    phone: string;
    email: string;
}

export default function UserInHome({ homeSelect, accessToken }: UserInHomeProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [admin, setAdmin] = useState<boolean | undefined>();
    const [showAddUserModal, setShowAddUserModal] = useState<Boolean>(false);
    const [reload, setReload] = useState<boolean | undefined>(false);
    const [confirmRemoveHomeVisible, setConfirmRemoveHomeVisible] = useState<boolean | undefined>(false);
    const [confirmDeleteVisible, setconfirmDeleteVisible] = useState<boolean | undefined>(false);
    const [selectedUserId, setSelectedUserId] = useState<string>("");

    const columns: GridColDef[] = [
        { field: 'index', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'age', headerName: 'Age', type: 'number', width: 90 },
        { field: 'gender', headerName: 'Gender', width: 90 },
        { field: 'address', headerName: 'Address', width: 150 },
        { field: 'phone', headerName: 'Phone', width: 120 },
        { field: 'email', headerName: 'Email', width: 200 },
    ];

    if (admin) {
        columns.push({
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: (params) => (
                <Button
                    onClick={() => {
                        setSelectedUserId(params.row.id);
                        setconfirmDeleteVisible(true);
                    }}
                    danger
                >
                    Delete
                </Button>
            ),
        });
    }

    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/user/deleteUserFromHome`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ uid: selectedUserId, hid: homeSelect }),
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.error) {
                    setReload(prev => !prev);
                    message.success(data.message);
                } else {
                    message.error(data.error);
                }
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            message.error('Error deleting user');
        }
    };

    const handleRemove = async () => {
        const uid = localStorage.getItem('uid') || '';
        try {
            const res = await fetch(`http://localhost:5000/api/user/removeHome`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ uid: uid, hid: homeSelect }),
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.error) {
                    setReload(prev => !prev);
                    message.success(data.message);
                } else {
                    message.error(data.error);
                }
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            message.error('Error deleting user');
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const resUsers = await fetch(`http://localhost:5000/api/user/getUserInHome/${homeSelect}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken,
                    }
                });
                if (resUsers.ok) {
                    const data = await resUsers.json();
                    if (!data.users) {
                        message.error(data.error);
                    } else {
                        // Map fetched data to User interface
                        const mappedUsers: User[] = data.users.map((user: any, index: number) => {
                            let gender: string;
                            if (user.gender === -1) {
                                gender = "Male";
                            } else if (user.gender === 1) {
                                gender = "Female";
                            } else {
                                gender = "Unknown";
                            }
                            return {
                                id: user._id,
                                name: user.name,
                                age: user.age,
                                gender: gender,
                                address: user.address,
                                phone: user.phone,
                                email: user.email,
                                index: index + 1,
                            };
                        });
                        setUsers(mappedUsers);
                        if (data.homeAdmin?._id == localStorage.getItem('uid')) {
                            setAdmin(true);
                        }
                        else {
                            setAdmin(false);
                        }
                    }
                } else {
                    console.error('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [homeSelect, accessToken, reload]); // Trigger the effect when homeSelect or accessToken changes

    const handleAddUser = () => {
        setShowAddUserModal(true);
    };

    const handleConfirmRemoveHome = () => {
        handleRemove();
        setConfirmRemoveHomeVisible(false);
    };

    const handleCancelRemoveHome = () => {
        setConfirmRemoveHomeVisible(false);
    };

    const handleConfirmDelete = () => {
        handleDelete();
        setconfirmDeleteVisible(false);
    };

    const handleCancelDelete = () => {
        setconfirmDeleteVisible(false);
    };


    return (
        <div>
            <div className="flex justify-between mb-4">
                {admin && (
                    <Button onClick={handleAddUser} type="primary" className='bg-blue-500'>
                        Add User
                    </Button>
                )}
                <Button onClick={() => setConfirmRemoveHomeVisible(true)} type="primary" className='bg-blue-500'>
                    Remove Home
                </Button>
            </div>
            <DataGrid
                rows={users}
                columns={columns}
                getRowId={(row) => row.id}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
            />
            {showAddUserModal && (
                <AddUser
                    accessToken={accessToken}
                    onCreate={() => {
                        setReload(prev => !prev);
                        setShowAddUserModal(false); // Close modal after creating user
                    }}
                    onCancel={() => setShowAddUserModal(false)}
                    homeSelect={homeSelect}
                />
            )}
            <Modal
                className='abc'
                title="Confirm Delete"
                visible={confirmDeleteVisible}
                onOk={handleConfirmDelete}
                onCancel={handleCancelDelete}
                okButtonProps={{ type: "primary", danger: true }}
            >
                <p>Are you sure you want to delete this user?</p>
            </Modal>
            <Modal
                title="Remove Home"
                visible={confirmRemoveHomeVisible}
                onOk={handleConfirmRemoveHome}
                onCancel={handleCancelRemoveHome}
                okButtonProps={{ type: "primary", danger: true }}
            >
                <p>Are you sure you want to remove this home?</p>
            </Modal>
        </div>
    );
}
