'use client'
import { useRouter } from "next/navigation";
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { message } from 'antd';

export default function Example() {
    const router = useRouter();

    const [about, setAbout] = useState("");
    const [editAbout, setEditAbout] = useState(false);
    const [initialAbout, setInitialAbout] = useState("");

    const [name, setName] = useState("");
    const [editName, setEditName] = useState(false);
    const [initialName, setInitialName] = useState("");

    const [age, setAge] = useState("");
    const [editAge, setEditAge] = useState(false);
    const [initialAge, setInitialAge] = useState("");

    const [gender, setGender] = useState("");
    const [editGender, setEditGender] = useState(false);
    const [initialGender, setInitialGender] = useState("");

    const [email, setEmail] = useState("");
    const [editEmail, setEditEmail] = useState(false);
    const [initialEmail, setInitialEmail] = useState("");

    const [phone, setPhone] = useState("");
    const [editPhone, setEditPhone] = useState(false);
    const [initialPhone, setInitialPhone] = useState("");

    const [address, setAddress] = useState("");
    const [editAddress, setEditAddress] = useState(false);
    const [initialAddress, setInitialAddress] = useState("");

    let accessToken: string;

    if (typeof localStorage !== 'undefined') {
        accessToken = localStorage.getItem('accessToken') || '';
        if (!accessToken) {
            console.error('accessToken not found');
            router.push('/login');
            return null;
        }
    } else {
        console.error('localStorage is not available');
        router.push('/login');
        return null;
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const resUser = await fetch(`http://localhost:5000/api/user/getUserProfile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken,
                    }
                });
                if (resUser.ok) {
                    const data = await resUser.json();
                    if (!data.user) {
                        message.error(data.error);
                    } else {
                        setName(data.user.name);
                        setAge(data.user.age);
                        setGender(data.user.gender === -1 ? "male" : "female");
                        setEmail(data.user.email);
                        setPhone(data.user.phone);
                        setAddress(data.user.address);
                        setAbout(data.user.about);
                    }
                } else {
                    console.error('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUser();
    }, [])

    // Edit About
    const handleEditAbout = () => {
        setInitialAbout(about);
        setEditAbout(true);
    };

    const handleSaveAbout = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/user/updateUserProfile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ about: about }),
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.error) {
                    message.success(data.message);
                } else {
                    message.error(data.error);
                }
            }
        } catch (error) {
            console.error('Error updating home:', error);
        }
        setEditAbout(false);
    };

    const handleCancelAbout = () => {
        setAbout(initialAbout);
        setEditAbout(false);
    };
    const handleChangeAbout = (event: any) => {
        setAbout(event.target.value);
    };

    // Edit Name
    const handleEditName = () => {
        setEditName(true);
        setInitialName(name);
    };

    const handleSaveName = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/user/updateUserProfile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ name: name }),
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.error) {
                    message.success(data.message);
                } else {
                    message.error(data.error);
                }
            }
        } catch (error) {
            console.error('Error updating home:', error);
        }
        setEditName(false);
    };

    const handleCancelName = () => {
        setName(initialName);
        setEditName(false);
    };

    const handleChangeName = (event: any) => {
        setName(event.target.value);
    };

    // Edit Age
    const handleEditAge = () => {
        setInitialAge(age);
        setEditAge(true);
    };

    const handleSaveAge = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/user/updateUserProfile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ age: age }),
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.error) {
                    message.success(data.message);
                } else {
                    message.error(data.error);
                }
            }
        } catch (error) {
            console.error('Error updating home:', error);
        }
        setEditAge(false);
    };

    const handleCancelAge = () => {
        setAge(initialAge);
        setEditAge(false);
    };

    const handleChangeAge = (event: any) => {
        setAge(event.target.value);
    };

    // Edit Gender
    const handleEditGender = () => {
        setInitialGender(gender);
        setEditGender(true);
    };

    const handleSaveGender = async () => {
        let genderNumber = gender === "male" ? -1 : 1;
        try {
            const res = await fetch(`http://localhost:5000/api/user/updateUserProfile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ gender: genderNumber }),
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.error) {
                    message.success(data.message);
                } else {
                    message.error(data.error);
                }
            }
        } catch (error) {
            console.error('Error updating home:', error);
        }
        setEditGender(false);
    };

    const handleCancelGender = () => {
        setGender(initialGender);
        setEditGender(false);
    };

    const handleChangeGender = (event: any) => {
        setGender(event.target.value);
    };

    // Edit Email
    const handleEditEmail = () => {
        setInitialEmail(email);
        setEditEmail(true);
    };

    const handleSaveEmail = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/user/updateUserProfile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ email: email }),
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.error) {
                    message.success(data.message);
                } else {
                    message.error(data.error);
                }
            }
        } catch (error) {
            console.error('Error updating home:', error);
        }
        setEditEmail(false);
    };

    const handleCancelEmail = () => {
        setEmail(initialEmail);
        setEditEmail(false);
    };

    const handleChangeEmail = (event: any) => {
        setEmail(event.target.value);
    };

    // Edit Phone
    const handleEditPhone = () => {
        setInitialPhone(phone);
        setEditPhone(true);
    };

    const handleSavePhone = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/user/updateUserProfile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ phone: phone }),
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.error) {
                    message.success(data.message);
                } else {
                    message.error(data.error);
                }
            }
        } catch (error) {
            console.error('Error updating home:', error);
        }
        setEditPhone(false);
    };

    const handleCancelPhone = () => {
        setPhone(initialPhone);
        setEditPhone(false);
    };

    const handleChangePhone = (event: any) => {
        setPhone(event.target.value);
    };

    // Edit Address
    const handleEditAddress = () => {
        setInitialAddress(address);
        setEditAddress(true);
    };

    const handleSaveAddress = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/user/updateUserProfile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ address: address }),
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.error) {
                    message.success(data.message);
                } else {
                    message.error(data.error);
                }
            }
        } catch (error) {
            console.error('Error updating home:', error);
        }
        setEditAddress(false);
    };

    const handleCancelAddress = () => {
        setAddress(initialAddress);
        setEditAddress(false);
    };

    const handleChangeAddress = (event: any) => {
        setAddress(event.target.value);
    };

    return (
        <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12 flex">
                <div className="w-2/5">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>
                </div>

                <div className="border-l border-gray-900/10 h-auto mr-8" />

                <div className="w-1/2 mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-2">
                        <div className="flex justify-between">
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                Name
                            </label>
                            {!editName && (
                                <button
                                    type="button"
                                    onClick={handleEditName}
                                    className="ml-2 px-3 py-1.5 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                                >
                                    <EditOutlined />
                                </button>
                            )}
                        </div>

                        <div className="mt-2 flex items-center ">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                autoComplete="name"
                                value={name}
                                onChange={handleChangeName}
                                className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                disabled={!editName}
                            />

                        </div>
                        {editName && (
                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={handleSaveName}
                                    className="px-3 py-1.5 text-sm font-semibold text-white bg-green-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelName}
                                    className="ml-2 px-3 py-1.5 text-sm font-semibold text-gray-900 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="sm:col-span-2">
                        <div className='flex justify-between'>
                            <label htmlFor="age" className="block text-sm font-medium leading-6 text-gray-900">
                                Age
                            </label>
                            {!editAge && (
                                <button
                                    type="button"
                                    onClick={handleEditAge}
                                    className="ml-2 px-3 py-1.5 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                                >
                                    <EditOutlined />
                                </button>
                            )}
                        </div>
                        <div className="mt-2 flex items-center">
                            <input
                                id="age"
                                name="age"
                                type="number"
                                value={age}
                                onChange={handleChangeAge}
                                className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                disabled={!editAge}
                            />
                        </div>
                        {editAge && (
                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={handleSaveAge}
                                    className="px-3 py-1.5 text-sm font-semibold text-white bg-green-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelAge}
                                    className="ml-2 px-3 py-1.5 text-sm font-semibold text-gray-900 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="sm:col-span-2">
                        <div className='flex justify-between'>
                            <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                                Gender
                            </label>
                            {!editGender && (
                                <button
                                    type="button"
                                    onClick={handleEditGender}
                                    className="ml-2 px-3 py-1.5 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                                >
                                    <EditOutlined />
                                </button>
                            )}
                        </div>
                        <div className="mt-2 flex items-center">
                            <select
                                id="gender"
                                name="gender"
                                value={gender}
                                onChange={handleChangeGender}
                                className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                disabled={!editGender}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        {editGender && (
                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={handleSaveGender}
                                    className="px-3 py-1.5 text-sm font-semibold text-white bg-green-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelGender}
                                    className="ml-2 px-3 py-1.5 text-sm font-semibold text-gray-900 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="sm:col-span-3">
                        <div className='flex justify-between'>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            {!editEmail && (
                                <button
                                    type="button"
                                    onClick={handleEditEmail}
                                    className="ml-2 px-3 py-1.5 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                                >
                                    <EditOutlined />
                                </button>
                            )}
                        </div>
                        <div className="mt-2 flex items-center ">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={handleChangeEmail}
                                className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                disabled={!editEmail}
                            />
                        </div>
                        {editEmail && (
                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={handleSaveEmail}
                                    className="px-3 py-1.5 text-sm font-semibold text-white bg-green-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelEmail}
                                    className="ml-2 px-3 py-1.5 text-sm font-semibold text-gray-900 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="sm:col-span-2">
                        <div className='flex justify-between'>
                            <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                                Phone number
                            </label>
                            {!editPhone && (
                                <button
                                    type="button"
                                    onClick={handleEditPhone}
                                    className="ml-2 px-3 py-1.5 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                                >
                                    <EditOutlined />
                                </button>
                            )}
                        </div>
                        <div className="mt-2 flex items-center ">
                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                autoComplete="tel"
                                value={phone}
                                onChange={handleChangePhone}
                                className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                disabled={!editPhone}
                            />
                        </div>
                        {editPhone && (
                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={handleSavePhone}
                                    className="px-3 py-1.5 text-sm font-semibold text-white bg-green-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelPhone}
                                    className="ml-2 px-3 py-1.5 text-sm font-semibold text-gray-900 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="col-span-full">
                        <div className='flex justify-between'>
                            <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                                Address
                            </label>
                            {!editAddress && (
                                <button
                                    type="button"
                                    onClick={handleEditAddress}
                                    className="ml-2 px-3 py-1.5 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                                >
                                    <EditOutlined />
                                </button>
                            )}
                        </div>
                        <div className="mt-2 flex items-center">
                            <input
                                type="text"
                                name="address"
                                id="address"
                                autoComplete="address"
                                value={address}
                                onChange={handleChangeAddress}
                                className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                disabled={!editAddress}
                            />
                        </div>
                        {editAddress && (
                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={handleSaveAddress}
                                    className="px-3 py-1.5 text-sm font-semibold text-white bg-green-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelAddress}
                                    className="ml-2 px-3 py-1.5 text-sm font-semibold text-gray-900 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12 flex">
                <div className="w-2/5">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        This information will be displayed publicly so be careful what you share.
                    </p>
                </div>

                <div className="border-l border-gray-900/10 h-auto mr-8" />

                <div className="w-1/2 mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="col-span-full">
                        <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                            Bio
                        </label>

                        <div className="mt-2">
                            {editAbout ? (
                                <textarea
                                    id="about"
                                    name="about"
                                    rows={3}
                                    value={about}
                                    onChange={handleChangeAbout}
                                    className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                />
                            ) : (
                                <p className="text-gray-900 font-semibold">{about}</p>
                            )}
                        </div>
                        {!editAbout && (
                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                Write a few sentences about yourself.
                                <button
                                    type="button"
                                    onClick={handleEditAbout}
                                    className="ml-2 px-3 py-1.5 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                                >
                                    <EditOutlined />
                                </button>
                            </p>
                        )}

                        {editAbout && (
                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={handleSaveAbout}
                                    className="px-3 py-1.5 text-sm font-semibold text-white bg-green-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelAbout}
                                    className="ml-2 px-3 py-1.5 text-sm font-semibold text-gray-900 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                            Photo
                        </label>
                        <div className="mt-2 flex items-center gap-x-3">
                            <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                            <button
                                type="button"
                                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                Change
                            </button>
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                            Cover photo
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}