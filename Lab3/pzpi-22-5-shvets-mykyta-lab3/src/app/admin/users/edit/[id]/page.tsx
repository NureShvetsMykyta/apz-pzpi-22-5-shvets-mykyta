"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Box,
    Button,
    Container,
    TextField,
    MenuItem,
    Typography,
    Alert,
} from "@mui/material";
import api from "@/services/api";
import { User } from "@/context/AuthContext";

const roles = ["SuperAdmin", "Admin", "Security", "Staff", "Student", "Guest"];

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [user, setUser] = useState<User | null>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState(roles[0]);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get<User[]>("/user/all")
            .then((res) => {
                const u = res.data.find((u) => u.id === id);
                if (!u) throw new Error("User not found");
                setUser(u);
                setFirstName(u.firstName);
                setLastName(u.lastName);
                setEmail(u.email);
                setRole(u.role);
            })
            .catch((err) => setError(err.message));
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await api.put("/user", { id, firstName, lastName, email });
            await api.post("/auth/assign-role", { userId: id, role });
            router.push("/admin/users");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to update user");
        }
    };

    if (!user) {
        return <Container sx={{ mt: 3 }}><Typography>Loading...</Typography></Container>;
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>Edit User</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
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
                        <MenuItem key={r} value={r}>{r}</MenuItem>
                    ))}
                </TextField>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button onClick={() => router.push('/admin/users')}>Cancel</Button>
                    <Button variant="contained" type="submit">Save</Button>
                </Box>
            </Box>
        </Container>
    );
}