"use client";

import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    CircularProgress,
    Box,
} from "@mui/material";
import api from "@/services/api";

interface RawLog {
    accessTime: string;
    status: "Granted" | "Denied";
    reason: string | null;
    fullName: string;
    roomName: string;
}

interface AccessLog {
    row: number;
    accessTime: string;
    status: "Granted" | "Denied";
    reason: string | null;
    fullName: string;
    roomName: string;
}

export default function AccessLogsPage() {
    const [logs, setLogs] = useState<AccessLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get<RawLog[]>("/accesslog/all")
            .then((resp) => {
                const mapped = resp.data.map((item, idx) => ({
                    row: idx + 1,
                    accessTime: item.accessTime,
                    status: item.status,
                    reason: item.reason,
                    fullName: item.fullName,
                    roomName: item.roomName,
                }));
                setLogs(mapped);
            })
            .catch((err) => console.error("Failed to fetch logs:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    height: "60vh",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Access Logs
            </Typography>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>№</TableCell>
                            <TableCell>Access Time</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Access Point</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log) => {
                            // відформатуємо ISO-рядок у локальний формат
                            const date = new Date(log.accessTime);
                            const dateStr = isNaN(date.valueOf())
                                ? "—"
                                : date.toLocaleString();

                            return (
                                <TableRow key={log.row}>
                                    <TableCell>{log.row}</TableCell>
                                    <TableCell>{dateStr}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={log.status}
                                            color={log.status === "Granted" ? "success" : "error"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{log.reason ?? "—"}</TableCell>
                                    <TableCell>{log.fullName}</TableCell>
                                    <TableCell>{log.roomName}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
