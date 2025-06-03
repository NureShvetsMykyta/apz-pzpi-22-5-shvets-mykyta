// src/app/admin/analytics/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import api from "@/services/api";
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Stack,
    Button,
    CircularProgress,
    Alert,
    TextField,
    useTheme,
    Grid,
} from "@mui/material";
import {
    AccessTime,
    Timeline,
    PieChart as PieIcon,
    Person,
    VpnKey,
    CalendarToday,
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

interface AccessLog {
    id: number;
    accessTime: string;
    fullName: string;
    roomName: string;
    status: number | string;
    userId: number;
    accessPointId: number;
}

export default function AnalyticsPage() {
    const theme = useTheme();

    const [from, setFrom] = useState<Date | null>(
        new Date(Date.now() - 29 * 864e5)
    );
    const [to, setTo] = useState<Date | null>(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [total, setTotal] = useState(0);
    const [granted, setGranted] = useState(0);
    const [denied, setDenied] = useState(0);

    const [daily, setDaily] = useState<{ date: string; count: number }[]>([]);
    const [hourly, setHourly] = useState<{ hour: string; count: number }[]>([]);
    const [statusDist, setStatusDist] = useState<
        { name: string; value: number }[]
    >([]);
    const [topUsers, setTopUsers] = useState<{ name: string; count: number }[]>(
    );
    const [topAps, setTopAps] = useState<{ name: string; count: number }[]>(
    );

    const PIE_COLORS = [theme.palette.success.main, theme.palette.error.main];

    const loadAnalytics = async () => {
        if (!from || !to) return;
        setLoading(true);
        setError(null);
        try {
            const { data: all } = await api.get<AccessLog[]>("/accesslog/all");

            const filtered = all.filter((l) => {
                const d = new Date(l.accessTime);
                return d >= from && d <= to;
            });

            setTotal(filtered.length);
            const isGranted = (s: number | string) =>
                s === 0 || s === "0" || String(s).toLowerCase() === "granted";
            const isDenied = (s: number | string) =>
                s === 1 || s === "1" || String(s).toLowerCase() === "denied";

            const g = filtered.filter((l) => isGranted(l.status)).length;
            const dnd = filtered.filter((l) => isDenied(l.status)).length;

            setGranted(g);
            setDenied(dnd);

            const daysCount =
                Math.floor((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000)) + 1;
            const avg = daysCount > 0 ? total / daysCount : 0;
            const avgPerDay = parseFloat(avg.toFixed(1));

            const dayMap: Record<string, number> = {};
            for (
                let dt = new Date(from.getFullYear(), from.getMonth(), from.getDate());
                dt <= to;
                dt.setDate(dt.getDate() + 1)
            ) {
                dayMap[dt.toISOString().slice(0, 10)] = 0;
            }
            filtered.forEach((l) => {
                const key = new Date(l.accessTime).toISOString().slice(0, 10);
                if (dayMap[key] != null) dayMap[key]++;
            });
            setDaily(
                Object.entries(dayMap).map(([date, count]) => ({ date, count }))
            );

            const hourMap: Record<number, number> = Array.from(
                { length: 24 },
                (_, i) => [i, 0]
            ).reduce((a, [h, c]) => ({ ...a, [h]: c }), {});
            filtered.forEach((l) => {
                const h = new Date(l.accessTime).getHours();
                hourMap[h] = (hourMap[h] || 0) + 1;
            });
            const hourlyArr = Object.entries(hourMap).map(([h, c]) => ({
                hour: `${h}:00`,
                count: c,
            }));
            setHourly(hourlyArr);

            setStatusDist([
                { name: "Granted", value: g },
                { name: "Denied", value: dnd },
            ]);

            const uMap: Record<string, number> = {};
            filtered.forEach((l) => {
                uMap[l.fullName] = (uMap[l.fullName] || 0) + 1;
            });
            setTopUsers(
                Object.entries(uMap)
                    .map(([name, count]) => ({ name, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
            );

            const aMap: Record<string, number> = {};
            filtered.forEach((l) => {
                aMap[l.roomName] = (aMap[l.roomName] || 0) + 1;
            });
            setTopAps(
                Object.entries(aMap)
                    .map(([name, count]) => ({ name, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
            );
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, [from, to, total]);

    const metrics = [
        { label: "Total", value: total, icon: <Timeline /> },
        {
            label: "Granted",
            value: granted,
            icon: <Timeline />,
            color: theme.palette.success.main,
        },
        {
            label: "Denied",
            value: denied,
            icon: <Timeline />,
            color: theme.palette.error.main,
        },
        {
            label: "Avg. Accesses/Day",
            value: parseFloat(((total / ((to!.getTime() - from!.getTime()) / 86400000 + 1)) || 0).toFixed(1)),
            icon: <CalendarToday />,
        },
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box p={4}>
                { }

                {error && <Alert severity="error">{error}</Alert>}

                { }
                <Card variant="outlined" sx={{ mb: 4 }}>
                    <Box p={2}>
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={2}
                            alignItems="center"
                        >
                            <DatePicker
                                label="From"
                                value={from}
                                onChange={(d) => setFrom(d)}
                                renderInput={(params) => <TextField {...params} size="small" />}
                            />
                            <DatePicker
                                label="To"
                                value={to}
                                onChange={(d) => setTo(d)}
                                renderInput={(params) => <TextField {...params} size="small" />}
                            />
                            <Box flexGrow={1} />
                            <Button variant="contained" onClick={loadAnalytics}>
                                Apply
                            </Button>
                        </Stack>
                    </Box>
                </Card>

                {loading ? (
                    <Box
                        height="50vh"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* KPI */}
                        <Grid container spacing={3} mb={4}>
                            {metrics.map((m, i) => (
                                <Grid key={i} item xs={12} sm={6} md={3}>
                                    <Card
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            p: 2,
                                            height: 140,
                                            bgcolor: m.color || "background.paper",
                                        }}
                                    >
                                        <Box mr={2}>{m.icon}</Box>
                                        <Box>
                                            <Typography variant="subtitle2">{m.label}</Typography>
                                            <Typography variant="h5">{m.value}</Typography>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Row 1: Daily + Hourly */}
                        <Box display="flex" gap={3} mb={4}>
                            <Card sx={{ flex: 1, height: 360 }}>
                                <CardHeader avatar={<AccessTime />} title="Daily Trend" />
                                <CardContent sx={{ height: "calc(100% - 64px)" }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={daily}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="count"
                                                stroke={theme.palette.primary.main}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card sx={{ flex: 1, height: 360 }}>
                                <CardHeader avatar={<AccessTime />} title="Hourly Peak" />
                                <CardContent sx={{ height: "calc(100% - 64px)" }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={hourly}>
                                            <XAxis dataKey="hour" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar
                                                dataKey="count"
                                                fill={theme.palette.primary.main}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* Row 2: Access Status + Top Users */}
                        <Box display="flex" gap={3} mb={4}>
                            <Card sx={{ flex: 1, height: 360 }}>
                                <CardHeader avatar={<PieIcon />} title="Access Status" />
                                <CardContent sx={{ height: "calc(100% - 64px)" }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusDist}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={90}
                                                label
                                            >
                                                {statusDist.map((_, idx) => (
                                                    <Cell
                                                        key={idx}
                                                        fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Legend verticalAlign="bottom" />
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card sx={{ flex: 1, height: 360 }}>
                                <CardHeader avatar={<Person />} title="Top Users" />
                                <CardContent sx={{ height: "calc(100% - 64px)" }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={topUsers}
                                            layout="vertical"
                                            margin={{ left: 50 }}
                                        >
                                            <XAxis type="number" />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                width={100}
                                            />
                                            <Tooltip />
                                            <Bar
                                                dataKey="count"
                                                fill={theme.palette.primary.main}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* Row 3: Top Access Points */}
                        <Box display="flex" justifyContent="center">
                            <Card sx={{ width: "50%", height: 360 }}>
                                <CardHeader avatar={<VpnKey />} title="Top Access Points" />
                                <CardContent sx={{ height: "calc(100% - 64px)" }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={topAps}
                                            layout="vertical"
                                            margin={{ left: 50 }}
                                        >
                                            <XAxis type="number" />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                width={100}
                                            />
                                            <Tooltip />
                                            <Bar
                                                dataKey="count"
                                                fill={theme.palette.primary.main}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Box>
                    </>
                )}
            </Box>
        </LocalizationProvider>
    );
}
