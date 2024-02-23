'use client'
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { message } from 'antd';
import { isPassword, isConfirmPassword } from '../../../../components/Validation';

export default function ChangePassword() {
    const router = useRouter();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // Log Error
    const [oldPasswordError, setOldPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    let uid: string;
    let accessToken: string;

    if (typeof localStorage !== 'undefined') {
        uid = localStorage.getItem('uid') || '';
        accessToken = localStorage.getItem('accessToken') || '';
        if (!uid) {
            console.error('User id not found');
        }
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

    const handleBlurOldPassword = () => {
        const passwordValidation = isPassword(oldPassword);
        if (passwordValidation.error) {
            setOldPasswordError(passwordValidation.error);
        }
        else {
            setOldPasswordError("");
        }
    };

    const handleBlurNewPassword = () => {
        const passwordValidation = isPassword(newPassword);
        if (passwordValidation.error) {
            setNewPasswordError(passwordValidation.error);
        }
        else {
            setNewPasswordError("");
        }
    };

    const handleBlurConfirmPassword = () => {
        const confirmPasswordValidation = isConfirmPassword(newPassword, confirmPassword);
        if (confirmPasswordValidation.error) {
            setConfirmPasswordError(confirmPasswordValidation.error);
        }
        else {
            setConfirmPasswordError("");
        }
    };

    const handleChangeOldPassword = (e: any) => {
        setOldPassword(e.target.value);
    };

    const handleChangeNewPassword = (e: any) => {
        setNewPassword(e.target.value);
    };

    const handleChangeConfirmPassword = (e: any) => {
        setConfirmPassword(e.target.value);
    };

    const handleSavePassword = async () => {
        const confirmPasswordValidation = isConfirmPassword(newPassword, confirmPassword);
        if (confirmPasswordValidation.error) {
            message.error(confirmPasswordValidation.error);
            return;
        }
        try {
            const res = await fetch(`http://localhost:5000/api/auth/editPassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ uid: uid, oldPassword: oldPassword, newPassword: newPassword }),
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.error) {
                    message.success(data.message);
                } else {
                    message.error(data.error);
                }
            } else {
                const data = await res.json();
                message.error(data.error);
            }
        } catch (error) {
            console.error('Error updating home:', error);
        }
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleCancelPassword = () => {
        // Reset form
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="space-y-12">
            <div className="flex">
                <div className="w-2/5">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Change Password</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Enter your old and new passwords below.</p>
                </div>

                <div className="border-l border-gray-900/10 h-auto mr-8" />

                <div className="w-1/2 mt-10 grid grid-cols-1 gap-y-8 sm:grid-cols-6">
                    <div className="col-start-2 col-span-4">
                        <label htmlFor="oldPassword" className="block text-sm font-medium leading-6 text-gray-900">
                            Old Password
                        </label>
                        <input
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            value={oldPassword}
                            onChange={handleChangeOldPassword}
                            onBlur={handleBlurOldPassword}
                            className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                        />
                        {oldPasswordError && <p className="text-red-500">{oldPasswordError}</p>}
                    </div>

                    <div className="col-start-2 col-span-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={newPassword}
                            onChange={handleChangeNewPassword}
                            onBlur={handleBlurNewPassword}
                            className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                        />
                        {newPasswordError && <p className="text-red-500">{newPasswordError}</p>}
                    </div>

                    <div className="col-start-2 col-span-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleChangeConfirmPassword}
                            onBlur={handleBlurConfirmPassword}
                            className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                        />
                        {confirmPasswordError && <p className="text-red-500">{confirmPasswordError}</p>}
                    </div>

                    <div className="sm:col-span-5">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleSavePassword}
                                className="px-3 py-1.5 text-sm font-semibold text-white bg-green-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelPassword}
                                className="ml-2 px-3 py-1.5 text-sm font-semibold text-gray-900 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
