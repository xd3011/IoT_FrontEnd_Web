'use client'
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { useState } from 'react';
import { message } from "antd";
import * as Validators from '@/../components/Validation';

export default function TheLogin() {
    const router = useRouter();
    const [user, setUser] = useState({
        user_name: "",
        pass_word: "",
    });

    const [error, setError] = useState({
        e_user_name: "",
        e_pass_word: "",
    })

    const resetValidation = () => {
        setError({
            e_user_name: "",
            e_pass_word: "",
        });
    }

    const validation = (user: any) => {
        resetValidation();
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
        resetValidation();
    };

    const handleLogin = async (e: any) => {
        e.preventDefault();
        const valid = validation(user);
        if (valid) return;
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            if (res.ok) {
                const data = await res.json();
                const time: number = Date.now() + 24 * 60 * 60 * 1000; // 1 ngày trong milliseconds
                localStorage.setItem('tokenTime', time.toString());
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('uid', data.uid);
                message.success(data.message);
                router.push('/room');
            } else {
                const data = await res.json();
                message.error(data.error);
            }
        } catch (error: any) {
            message.error(error.message);
        }
    }

    const handleInputChange = (e: any) => {
        setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
                    Sign In
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="user_name" className="block text-sm font-medium leading-6 text-gray-900">
                            User Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="user_name"
                                name="user_name"
                                type="text"
                                autoComplete="user_name"
                                required
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={handleInputChange}
                            />
                            {error.e_user_name && <p className="text-red-700">{error.e_user_name}</p>}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="pass_word" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="text-sm">
                                <Link href="/forgotpassword" passHref className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="pass_word"
                                name="pass_word"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={handleInputChange}
                            />
                            {error.e_pass_word && <p className="text-red-700">{error.e_pass_word}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{' '}
                    <Link href="/register" passHref className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Sign Up Account
                    </Link>
                </p>
            </div>
        </div>
    );
}