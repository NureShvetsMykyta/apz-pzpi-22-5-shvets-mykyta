"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Alert,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";
import api from "@/services/api";

interface Room { id: number; name: string; }
const types = ["QR", "RFID"];

export default function CreateAccessPointPage() {
    const router = useRouter();
    const [typeValue, setTypeValue] = useState<string>(types[0]);
    const [identifier, setIdentifier] = useState<string>("");
    const [roomId, setRoomId] = useState<number | string>("");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        api.get<Room[]>("/room").then(res => setRooms(res.data)).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await api.post("/accesspoint", { type: typeValue, identifier, roomId });
            router.push("/admin/access-points");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to create access point");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
                Create Access Point
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={typeValue}
                        label="Type"
                        onChange={e => setTypeValue(e.target.value as string)}
                    >
                        {types.map(t => (
                            <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Identifier"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    required
                />
                <FormControl fullWidth>
                    <InputLabel>Room</InputLabel>
                    <Select
                        value={String(roomId)}
                        label="Room"
                        onChange={e => setRoomId(e.target.value)}
                    >
                        {rooms.map(r => (
                            <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button onClick={() => router.push('/admin/access-points')}>Cancel</Button>
                    <Button variant="contained" type="submit">
                        Create
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}