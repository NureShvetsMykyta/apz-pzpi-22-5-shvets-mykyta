"use client";

import React, { useState, useEffect } from "react";
import {
    Container,
    Card,
    CardContent,
    Typography,
    Box,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BlockIcon from "@mui/icons-material/Block";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import api from "@/services/api";

interface RawLog {
    accessTime: string;
    fullName:   string;
    roomName:   string;
    status:     "Granted" | "Denied";
}

interface RecentAccess {
    name:  string;
    point: string;
    time:  string;
}

interface Visit {
    date:  string;
    count: number;
}

export default function AdminDashboard() {
    const [users,    setUsers]    = useState(0);
    const [points,   setPoints]   = useState(0);
    const [denied,   setDenied]   = useState(0);
    const [requests, setRequests] = useState(0);
    const [recent,   setRecent]   = useState<RecentAccess[]>([]);
    const [visits,   setVisits]   = useState<Visit[]>([]);
    const [loading,  setLoading]  = useState(true);

    useEffect(() => {
        setRequests(0);

        Promise.all([
            api.get("/user/all"),
            api.get("/accesspoint"),
            api.get<RawLog[]>("/accesslog/all"),
        ])
            .then(([uRes, pRes, lRes]) => {
                setUsers(uRes.data.length);
                setPoints(pRes.data.length);

                const logs = lRes.data;
                setDenied(logs.filter((l) => l.status === "Denied").length);

                setRecent(
                    logs
                        .slice(-5)
                        .reverse()
                        .map((l) => ({
                            name:  l.fullName,
                            point: l.roomName,
                            time:  new Date(l.accessTime).toLocaleTimeString([], {
                                hour:   "2-digit",
                                minute: "2-digit",
                            }),
                        }))
                );

                const byDay: Record<string, number> = {};
                logs.forEach((l) => {
                    const d = new Date(l.accessTime).toLocaleDateString([], {
                        month: "short",
                        day:   "numeric",
                    });
                    byDay[d] = (byDay[d] || 0) + 1;
                });
                setVisits(Object.entries(byDay).map(([date, count]) => ({ date, count })));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    display:       "flex",
                    alignItems:    "center",
                    justifyContent: "center",
                    height:        "60vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gap={3}
            >
                { }
                <Box gridColumn="span 3">
                    <Card sx={{ height: "100%" }}>
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <DashboardIcon sx={{ fontSize: 32, color: "primary.main" }} />
                            <Box>
                                <Typography variant="subtitle2">Total Users</Typography>
                                <Typography variant="h4">{users}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                <Box gridColumn="span 3">
                    <Card sx={{ height: "100%" }}>
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <DashboardIcon sx={{ fontSize: 32, color: "primary.main" }} />
                            <Box>
                                <Typography variant="subtitle2">Access Points</Typography>
                                <Typography variant="h4">{points}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                <Box gridColumn="span 3">
                    <Card sx={{ height: "100%" }}>
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <BlockIcon sx={{ fontSize: 32, color: "primary.main" }} />
                            <Box>
                                <Typography variant="subtitle2">Access Denied</Typography>
                                <Typography variant="h4">{denied}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                <Box gridColumn="span 3">
                    <Card sx={{ height: "100%" }}>
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <MailOutlineIcon sx={{ fontSize: 32, color: "primary.main" }} />
                            <Box>
                                <Typography variant="subtitle2">Access Requests</Typography>
                                <Typography variant="h4">{requests}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                { }
                <Box gridColumn="span 8">
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Campus Visits
                            </Typography>
                            <Box sx={{ width: "100%", height: 350 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={visits}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                { }
                <Box gridColumn="span 4">
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Recent Accesses
                            </Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>User</TableCell>
                                            <TableCell>Access Point</TableCell>
                                            <TableCell>Time</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recent.map((r, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{r.name}</TableCell>
                                                <TableCell>{r.point}</TableCell>
                                                <TableCell>{r.time}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Container>
    );
}
