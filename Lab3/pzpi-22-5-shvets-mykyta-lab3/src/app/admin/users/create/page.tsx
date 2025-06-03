"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import axios from "axios";
import {
    Box,
    Button,
    Container,
    TextField,
    MenuItem,
    Typography,
    Alert,
} from "@mui/material";

const roles = ["SuperAdmin", "Admin", "Security", "Staff", "Student", "Guest"];

const roleMap: Record<string, number> = Object.fromEntries(
    roles.map((r,i) => [r, i])
);

export default function CreateUserPage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName,  setLastName]  = useState("");
    const [email,     setEmail]     = useState("");
    const [role,      setRole]      = useState(roles[0]);
    const [error,     setError]     = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await api.post<string>("/auth/register", {
                firstName,
                lastName,
                email,
                role: roleMap[role],
            });
            router.push("/admin/users");
        } catch (err: unknown) {
            console.error(err);

            let msg = "Failed to create user";

            if (axios.isAxiosError(err) && err.response) {
                const data = err.response.data;

                if (typeof data === "string") {
                    msg = data;
                } else if (typeof data === "object" && data !== null) {
                    const pd = data as {
                        title?: string;
                        errors?: Record<string, string[]>;
                    };
                    if (pd.title) {
                        msg = pd.title;
                        if (pd.errors) {
                            const details = Object
                                .values(pd.errors)
                                .flat()
                                .join(" ");
                            if (details) msg += ": " + details;
                        }
                    } else {
                        msg = JSON.stringify(data);
                    }
                }
            }

            setError(msg);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
                Create User
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "grid", gap: 2 }}
            >
                <TextField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    select
                    label="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    {roles.map((r) => (
                        <MenuItem key={r} value={r}>
                            {r}
                        </MenuItem>
                    ))}
                </TextField>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                    <Button onClick={() => router.push("/admin/users")}>Cancel</Button>
                    <Button variant="contained" type="submit">
                        Create
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
