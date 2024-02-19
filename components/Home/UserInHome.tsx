import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { message, Button } from 'antd';
import AddUser from './AddUser';


interface UserInHomeProps {
    homeSelect: string;
    accessToken: string;
}

interface User {
    id: number;
    name: string;
    age: number;
    sex: string;
    address: string;
    phone: string;
    email: string;
}

export default function UserInHome({ homeSelect, accessToken }: UserInHomeProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [admin, setAdmin] = useState<Boolean>();
    const [showAddUserModal, setShowAddUserModal] = useState<Boolean>(false);
    const [reload, setReload] = useState<Boolean>(false);


    const columns: GridColDef[] = [
        { field: 'index', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'age', headerName: 'Age', type: 'number', width: 90 },
        { field: 'sex', headerName: 'Sex', width: 90 },
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
                    onClick={() => handleDelete(params.row.id)}
                    danger
                >
                    Delete
                </Button>
            ),
        });
    }

    const handleDelete = async (userId: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/user/deleteUserFromHome`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ uid: userId, hid: homeSelect }),
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
                        const mappedUsers: User[] = data.users.map((user: any, index: number) => ({
                            id: user._id,
                            name: user.name,
                            age: user.age,
                            sex: user.sex,
                            address: user.address,
                            phone: user.phone,
                            email: user.email,
                            index: index + 1, // Increment index by 1
                        }));
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


    return (
        <div>
            {admin && (
                <Button onClick={handleAddUser} type="primary" className='bg-blue-500 mb-4'>
                    Add User
                </Button>
            )}
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
        </div>
    );
}
