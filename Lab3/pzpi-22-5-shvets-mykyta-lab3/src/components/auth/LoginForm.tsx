// src/components/auth/LoginForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, User } from "@/context/AuthContext";
import { Container, Box, TextField, Button, Alert } from "@mui/material";

const roleRedirects: Record<string, string> = {
    SuperAdmin: "/admin/dashboard",
    Admin:      "/admin/dashboard",
    Security:   "/admin/security",
    Staff:      "/user/dashboard",
    Student:    "/user/dashboard",
    Guest:      "/guest/home",
};

export default function LoginForm() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [error, setError]       = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            // login() вернёт User и сохранит токен в sessionStorage
            const user: User = await login(email, password);

            // редирект по роли
            const dest = roleRedirects[user.role] || "/";
            router.replace(dest);
        } catch (err: any) {
            console.error("Login error:", err);
            setError(
                err.response?.data ||
                err.message ||
                "Login failed"
            );
        }
    };

    return (
        <Container maxWidth="xs">
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 8 }}>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    sx={{ mt: 2 }}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    sx={{ mt: 2 }}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                    Log In
                </Button>
            </Box>
        </Container>
    );
}
