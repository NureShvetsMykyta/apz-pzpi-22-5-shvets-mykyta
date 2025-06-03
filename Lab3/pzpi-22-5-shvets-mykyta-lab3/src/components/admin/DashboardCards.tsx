// src/app/admin/dashboard/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
} from "@mui/material";
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
import DashboardIcon from "@mui/icons-material/Dashboard";
import BlockIcon from "@mui/icons-material/Block";

interface Access { name: string; point: string; time: string; }
interface Visit  { date: string; count: number; }

export default function AdminDashboard() {
    const [stats,  setStats]  = useState({ totalUsers: 0, points: 0, denied: 0 });
    const [recent, setRecent] = useState<Access[]>([]);
    const [visits, setVisits] = useState<Visit[]>([]);

    useEffect(() => {
        api.get("/admin/stats").then((r) => setStats(r.data));
        api.get("/admin/recent-accesses").then((r) => setRecent(r.data));
        api.get("/admin/visits").then((r) => setVisits(r.data));
    }, []);

    return (
        <Box sx={{ p: 3, mt: 8 }}>
            <Grid container spacing={3}>
                {[
                    { label: "Total Users",   icon: <DashboardIcon />, value: stats.totalUsers },
                    { label: "Access Points", icon: <DashboardIcon />, value: stats.points },
                    { label: "Access Denied", icon: <BlockIcon />,     value: stats.denied },
                ].map(({ label, icon, value }) => (
                    <Grid item xs={12} md={4} key={label}>
                        <Card>
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{ fontSize: 32, color: "primary.main" }}>{icon}</Box>
                                <Box>
                                    <Typography variant="subtitle2">{label}</Typography>
                                    <Typography variant="h4">{value}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12} md={6}>
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
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Campus Visits
                            </Typography>
                            <Box sx={{ width: "100%", height: 260 }}>
                                <ResponsiveContainer>
                                    <LineChart data={visits}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
