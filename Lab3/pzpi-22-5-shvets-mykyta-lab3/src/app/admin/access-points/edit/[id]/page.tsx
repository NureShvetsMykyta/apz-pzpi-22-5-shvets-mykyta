"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

interface AccessPoint { id: number; type: string; identifier: string; roomId: number; }
interface Room { id: number; name: string; }
const types = ["QR", "RFID"];

export default function EditAccessPointPage() {
    const router = useRouter();
    const { id } = useParams();
    const apId = Number(id);

    const [point, setPoint] = useState<AccessPoint | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [typeValue, setTypeValue] = useState<string>("");
    const [identifier, setIdentifier] = useState<string>("");
    const [roomId, setRoomId] = useState<number | string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        api.get<Room[]>("/room").then(res => setRooms(res.data)).catch(console.error);
        api.get<AccessPoint>(`/accesspoint/${apId}`)
            .then(res => {
                const p = res.data;
                setPoint(p);
                setTypeValue(p.type);
                setIdentifier(p.identifier);
                setRoomId(p.roomId);
            })
            .catch(console.error);
    }, [apId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await api.put(`/accesspoint/${apId}`, { type: typeValue, identifier, roomId });
            router.push("/admin/access-points");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to update");
        }
    };

    if (!point) {
        return (
            <Container sx={{ mt: 3 }}>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>Edit Access Point</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select value={typeValue} label="Type" onChange={e => setTypeValue(e.target.value as string)}>
                        {types.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
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
                    <Select value={String(roomId)} label="Room" onChange={e => setRoomId(Number(e.target.value))}>
                        {rooms.map(r => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button onClick={() => router.push('/admin/access-points')}>Cancel</Button>
                    <Button variant="contained" type="submit">Save</Button>
                </Box>
            </Box>
        </Container>
    );
}