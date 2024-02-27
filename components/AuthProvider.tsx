'use client'

import { message } from "antd";
import { useRouter } from "next/navigation";

export default function AuthProvider() {
    const router = useRouter();
    let accessToken: string;
    let tokenTime: string;
    let uid: string;

    const handleLogout = async () => {
        const res = await fetch(`http://localhost:5000/api/auth/logout/${uid}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (res.ok) {
            const data = await res.json();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('uid');
            message.success(data.message);
            router.push('/login');
        } else {
            const data = await res.json();
            message.error(data.error);
        }
    }

    if (typeof localStorage !== 'undefined') {
        accessToken = localStorage.getItem('accessToken') || '';
        uid = localStorage.getItem('uid') || '';
        if (!accessToken) {
            console.error('accessToken not found');
            router.push('/login');
            return null;
        }
        tokenTime = localStorage.getItem('tokenTime') || '';
        if (!tokenTime || Number(tokenTime) < Date.now()) {
            handleLogout();
        }
    } else {
        console.error('localStorage is not available');
        router.push('/login');
        return null;
    }

    return;
}