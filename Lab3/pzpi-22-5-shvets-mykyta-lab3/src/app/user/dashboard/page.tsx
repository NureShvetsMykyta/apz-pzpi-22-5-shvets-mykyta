// src/app/user/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    CircularProgress,
    Alert,
    useTheme,
} from '@mui/material';
import {
    People as PeopleIcon,
    CalendarToday as CalendarIcon,
    PendingActions as PendingIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { useTranslation } from 'react-i18next';

import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

interface RawAccessLog {
    accessTime: string;
    roomName: string;
}

interface AccessLog {
    id: string;
    accessTime: string;
    point: string;
}

interface AccessRuleResponse {
    id: number;
}

export default function UserDashboardPage() {
    const theme = useTheme();
    const { user } = useAuth();
    const { t: tDash } = useTranslation('dashboard');

    const [logs, setLogs] = useState<AccessLog[]>([]);
    const [rules, setRules] = useState<AccessRuleResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        Promise.all([
            api.get<RawAccessLog[]>('/accesslog/user'),
            api.get<AccessRuleResponse[]>('/accessrule/my'),
        ])
            .then(([logsRes, rulesRes]) => {
                const mapped: AccessLog[] = logsRes.data.map((r, idx) => ({
                    id: idx.toString(),
                    accessTime: r.accessTime,
                    point: r.roomName,
                }));
                setLogs(mapped);
                setRules(rulesRes.data);
            })
            .catch(() => {
                setError(tDash('errorLoading'));      // перевод для ошибки
            })
            .finally(() => {
                setLoading(false);
            });
    }, [tDash]);

    if (loading) {
        return (
            <Box display="flex" height="60vh" alignItems="center" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    // ─── Статистика ───
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    const visits7 = logs.filter(l => new Date(l.accessTime) >= weekAgo).length;
    const pendingRules = rules.length;

    const stats = [
        {
            key: 'accessLevel',
            icon: <PeopleIcon />,
            label: tDash('stats.accessLevel'),
            value: user?.role ?? '—',
        },
        {
            key: 'visits7',
            icon: <CalendarIcon />,
            label: tDash('stats.visits7'),
            value: visits7,
        },
        {
            key: 'accessRules',
            icon: <PendingIcon />,
            label: tDash('stats.accessRules'),
            value: pendingRules,
        },
    ];

    // ─── Данные для графика ───
    const days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(weekAgo);
        d.setDate(d.getDate() + i);
        return d;
    });
    const chartData = {
        labels: days.map(d =>
            d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        ),
        datasets: [
            {
                label: tDash('stats.visits7'),     // подпись графика
                data: days.map(d =>
                    logs.filter(l => new Date(l.accessTime).toDateString() === d.toDateString())
                        .length
                ),
                borderColor: theme.palette.primary.main,
                tension: 0.3,
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        plugins: { legend: { display: false as const } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
    };

    // ─── Последние 4 визита ───
    const recent4 = [...logs]
        .sort((a, b) => +new Date(b.accessTime) - +new Date(a.accessTime))
        .slice(0, 4);

    return (
        <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
            {/* Приветствие */}
            <Typography variant="h4" sx={{ mb: 2 }}>
                {tDash('welcome', { name: user?.firstName })}
            </Typography>

            {/* Карточки статистики */}
            <Grid container spacing={3} mb={4}>
                {stats.map(s => (
                    <Grid item xs={12} sm={4} key={s.key}>
                        <Card
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                boxShadow: 1,
                                borderRadius: 2,
                                bgcolor: theme.palette.background.paper,
                            }}
                        >
                            <Box sx={{ mr: 2 }}>{s.icon}</Box>
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary">
                                    {s.label}
                                </Typography>
                                <Typography variant="h6">{s.value}</Typography>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* График и Recent Visits */}
            <Paper
                elevation={1}
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    p: 3,
                    mb: 4,
                    borderRadius: 2,
                    gap: 3,
                    bgcolor: theme.palette.background.paper,
                }}
            >
                {/* Visits Over Time */}
                <Box sx={{ flex: 3, minHeight: 250 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        {tDash('stats.visits7')}
                    </Typography>
                    <Line data={chartData} options={chartOptions} />
                </Box>

                {/* Recent Visits */}
                <Box sx={{ flex: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        {tDash('recent.title')}
                    </Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{tDash('recent.point')}</TableCell>
                                    <TableCell>{tDash('recent.date')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recent4.length === 0 ? (
                                    <TableRow key="none">
                                        <TableCell colSpan={2} align="center">
                                            {tDash('recent.noData')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recent4.map(log => (
                                        <TableRow key={log.id}>
                                            <TableCell>{log.point}</TableCell>
                                            <TableCell>
                                                {new Date(log.accessTime).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Paper>
        </Container>
    );
}
