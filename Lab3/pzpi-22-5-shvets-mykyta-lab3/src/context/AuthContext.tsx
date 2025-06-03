// src/context/AuthContext.tsx
"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import api from "@/services/api";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatarUrl?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User>;
    loginAsGuest(): void;
    logout: () => void;
    updateAvatar: (form: FormData) => Promise<void>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser]     = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }
        api.get<User>("/user")
            .then(res => setUser(res.data))
            .catch(() => {
                sessionStorage.removeItem("token");
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (email: string, password: string) => {
        const resp = await api.post<{ token: string }>("/auth/login", {
            email,
            password,
        });
        const token = resp.data.token;

        sessionStorage.setItem("token", token);

        const me = await api.get<User>("/user");
        setUser(me.data);
        return me.data;
    };

    const loginAsGuest = () => {
        setUser({
            id: 'guest',
            firstName: 'Guest',
            role: 'Guest',
        });
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        setUser(null);
    };

    const updateAvatar = async (form: FormData) => {
        const { data } = await api.post<{ avatarUrl: string }>('/auth/update-avatar', form);
        setUser(user => user ? { ...user, avatarUrl: data.avatarUrl } : null);
    };

    const changePassword = async (oldPassword: string, newPassword: string) => {
        try {
            const { data } = await api.post<string>('/auth/change-password', { oldPassword, newPassword });
            return { success: true, message: data };
        } catch (err: any) {
            const msg = err.response?.data ?? err.message;
            return { success: false, message: msg };
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, loginAsGuest, logout, updateAvatar, changePassword }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
}
