'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import * as Validators from "@/components/Validation";
import { message } from 'antd';

export default function TheForgotPassword() {
    const [forgotStep, setForgotStep] = useState(1);
    const [uid, setUid] = useState('');
    const [otp, setOtp] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [userInput, setUserInput] = useState({
        username: "",
        emailOrPhone: "",
    });

    const [error, setError] = useState({
        e_username: "",
        e_emailOrPhone: "",
        e_otp: "",
        e_newPassword: "",
        e_confirmPassword: "",
    });

    const [isEmailInput, setIsEmailInput] = useState(true);

    const resetValidation = () => {
        setError({
            e_username: "",
            e_emailOrPhone: "",
            e_otp: "",
            e_newPassword: "",
            e_confirmPassword: "",
        });
    };

    const validation = () => {
        resetValidation();
        let valid = true;

        const usernameValidation = Validators.isUsername(userInput.username);
        if (usernameValidation.error) {
            setError((prevError) => ({ ...prevError, e_username: usernameValidation.error }));
            valid = false;
        }

        const emailOrPhoneValidation = isEmailInput
            ? Validators.isEmail(userInput.emailOrPhone)
            : Validators.isPhoneNumber(userInput.emailOrPhone);

        if (emailOrPhoneValidation.error) {
            setError((prevError) => ({ ...prevError, e_emailOrPhone: emailOrPhoneValidation.error }));
            valid = false;
        }

        return valid;
    };

    const handleForgotPassword = async (e: any) => {
        e.preventDefault();
        const isValid = validation();
        if (!isValid) return;
        try {
            const res = await fetch('http://localhost:5000/api/auth/forgotPassword', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_name: userInput.username,
                    [isEmailInput ? 'email' : 'phone']: userInput.emailOrPhone
                }),
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.uid) {
                    message.warning("Can't find user");
                }
                else {
                    setUid(data.uid);
                    setForgotStep(2);
                }
            } else {
                const data = await res.json();
                message.error(data.error);
            }
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const handleOTPVerification = async (e: any) => {
        e.preventDefault();
        const otpValidation = Validators.isOTP(otp);
        if (otpValidation.error) {
            setError((prevError) => ({ ...prevError, e_otp: otpValidation.error }));
            return;
        }
        try {
            const res = await fetch('http://localhost:5000/api/auth/verifyOTP', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uid,
                    otp
                }),
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.accessToken) {
                    message.warning("Can't find user");
                }
                else {
                    setAccessToken(data.accessToken);
                    setForgotStep(3);
                }
            } else {
                const data = await res.json();
                message.error(data.error);
            }
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const handleResetPassword = async (e: any) => {
        e.preventDefault();
        const newPasswordValidation = Validators.isPassword(newPassword);
        if (newPasswordValidation.error) {
            setError((prevError) => ({ ...prevError, e_newPassword: newPasswordValidation.error }));
            return;
        }
        const confirmPasswordValidation = Validators.isConfirmPassword(newPassword, confirmPassword);
        if (confirmPasswordValidation.error) {
            setError((prevError) => ({ ...prevError, e_confirmPassword: confirmPasswordValidation.error }));
            return;
        }
        // Proceed with password reset
        try {
            // Example fetch request to reset password
            const res = await fetch('http://localhost:5000/api/auth/resetPassword', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': accessToken,
                },
                body: JSON.stringify({
                    newPassword
                }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    message.success(data.message);
                }
            } else {
                const data = await res.json();
                message.error(data.error);
            }
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setUserInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleOTPChange = (e: any) => {
        setOtp(e.target.value);
    };

    const handleNewPasswordChange = (e: any) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: any) => {
        setConfirmPassword(e.target.value);
    };

    const toggleEmailPhone = () => {
        setUserInput((prev) => ({
            ...prev,
            emailOrPhone: "",
        }));
        setIsEmailInput((prev) => !prev);
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Forgot Password
                </h2>
            </div>

            {forgotStep === 1 && (
                // Form to request OTP
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleForgotPassword}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={userInput.username}
                                    onChange={handleInputChange}
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {error.e_username && <p className="text-red-700">{error.e_username}</p>}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="emailOrPhone" className="block text-sm font-medium leading-6 text-gray-900">
                                    {isEmailInput ? "Email" : "Phone"}
                                </label>
                                <div className="text-sm">
                                    <button
                                        type="button"
                                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                                        onClick={toggleEmailPhone}
                                    >
                                        {isEmailInput ? "Use Phone" : "Use Email"}
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="emailOrPhone"
                                    name="emailOrPhone"
                                    type="text"
                                    autoComplete={isEmailInput ? "email" : "tel"}
                                    required
                                    value={userInput.emailOrPhone}
                                    onChange={handleInputChange}
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {error.e_emailOrPhone && <p className="text-red-700">{error.e_emailOrPhone}</p>}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {forgotStep === 2 && (
                // Form to enter OTP
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleOTPVerification}>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">
                                OTP
                            </label>
                            <div className="mt-2">
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    autoComplete="otp"
                                    required
                                    value={otp}
                                    onChange={handleOTPChange}
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {error.e_otp && <p className="text-red-700">{error.e_otp}</p>}
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Verify OTP
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {forgotStep === 3 && (
                // Form to reset password
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleResetPassword}>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                New Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {error.e_newPassword && <p className="text-red-700">{error.e_newPassword}</p>}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                Confirm Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="confirm-password"
                                    required
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {error.e_confirmPassword && <p className="text-red-700">{error.e_confirmPassword}</p>}
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <p className="mt-10 text-center text-sm text-gray-500">
                Remembered your password?{' '}
                <Link href="/login" passHref className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    Sign In
                </Link>
            </p>
        </div>
    );
}
