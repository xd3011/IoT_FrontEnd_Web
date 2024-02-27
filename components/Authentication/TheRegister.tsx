'use client'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useState } from 'react';
import { message } from "antd";
import * as Validators from '@/../components/Validation';

export default function TheRegister() {
    const router = useRouter();
    const [newUser, setNewUser] = useState({
        email: "",
        phone: "",
        user_name: "",
        pass_word: "",
        confirm_password: "",
        name: "",
    });

    const [error, setError] = useState({
        e_email: "",
        e_phone: "",
        e_user_name: "",
        e_pass_word: "",
        e_confirm_password: "",
    })

    const resetValidation = () => {
        setError({
            e_email: "",
            e_phone: "",
            e_user_name: "",
            e_pass_word: "",
            e_confirm_password: "",
        })
    }

    const validation = (user: any) => {
        resetValidation();
        const validEmail = Validators.isEmail(user.email);
        if (validEmail.error) {
            message.error(validEmail.error);
            setError((prevError) => ({ ...prevError, e_email: validEmail.error }));
            return 1;
        }
        const validPhoneNumber = Validators.isPhoneNumber(user.phone);
        if (validPhoneNumber.error) {
            message.error(validPhoneNumber.error);
            setError((prevError) => ({ ...prevError, e_email: validPhoneNumber.error }));
            return 1;
        }
        const validUsername = Validators.isUsername(user.user_name);
        if (validUsername.error) {
            // Check if there is an error
            message.error(validUsername.error);
            setError((prevError) => ({ ...prevError, e_user_name: validUsername.error }));
            return 1;
        }
        // Continue with other validations or actions if needed
        const validPassword = Validators.isPassword(user.pass_word);
        if (validPassword.error) {
            message.error(validPassword.error);
            setError((prevError) => ({ ...prevError, e_pass_word: validPassword.error }));
            return 1;
        }
        const validConfirmPassword = Validators.isConfirmPassword(user.pass_word, user.confirm_password);
        if (validConfirmPassword.error) {
            message.error(validConfirmPassword.error);
            setError((prevError) => ({ ...prevError, e_pass_word: validConfirmPassword.error }));
            return 1;
        }
        resetValidation();
    };

    const handleRegister = async (e: any) => {
        e.preventDefault();
        const valid = validation(newUser);
        if (valid) {
            return;
        }
        try {
            const { confirm_password, ...user } = newUser
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            })
            if (res.ok) {
                const data = await res.json();
                message.success(data.message);
                router.push('/login');
            }
            else {
                const data = await res.json();
                message.error(data.error);
            }
        }
        catch (error: any) {
            message.error(error.message);
        }
    };

    const handleInputChange = (e: any) => {
        setNewUser((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-10 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign up
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleRegister}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                            Phone number
                        </label>
                        <div className="mt-2">
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                required
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="user_name" className="block text-sm font-medium leading-6 text-gray-900">
                            User Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="user_name"
                                name="user_name"
                                type="text"
                                autoComplete="username"
                                required
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="pass_word" className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="pass_word"
                                name="pass_word"
                                type="password"
                                required
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirm_password" className="block text-sm font-medium leading-6 text-gray-900">
                            Confirm Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="confirm_password"
                                name="confirm_password"
                                type="password"
                                required
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                            Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign up
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Do you already have an account{' '}
                    <Link href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500" >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}