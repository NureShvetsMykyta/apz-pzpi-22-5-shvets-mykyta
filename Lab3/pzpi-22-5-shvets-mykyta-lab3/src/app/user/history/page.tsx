// src/app/user/history/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
    Box,
    Paper,
    Grid,
    Chip,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Toolbar,
    Skeleton,
    useTheme,
    useMediaQuery,
    Typography,
    TablePagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import api from '@/services/api';

interface RawLog {
    accessTime?: string;
    roomName?: string;
    status: 'Granted' | 'Denied';
    reason?: string | null;
}

interface Log {
    date: string;
    time: string;
    point: string;
    status: 'granted' | 'denied';
    reason: string;
}

export default function HistoryPage() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('md'));
    const { t } = useTranslation('history');

    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'granted' | 'denied'>('all');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { data } = await api.get<RawLog[]>('/accesslog/user');
                const mapped = data.map(r => {
                    const dt = r.accessTime ? new Date(r.accessTime) : null;
                    return {
                        date: dt ? dt.toLocaleDateString() : '—',
                        time: dt
                            ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : '—',
                        point: r.roomName ?? '—',
                        status: r.status.toLowerCase() as 'granted' | 'denied',
                        reason: r.reason?.trim() ? r.reason! : '—',
                    };
                });
                mapped.sort((a, b) => {
                    const da = a.date !== '—' && a.time !== '—'
                        ? new Date(`${a.date} ${a.time}`)
                        : new Date(0);
                    const db = b.date !== '—' && b.time !== '—'
                        ? new Date(`${b.date} ${b.time}`)
                        : new Date(0);
                    return db.getTime() - da.getTime();
                });
                setLogs(mapped);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // фильтрация
    const filtered = useMemo(() => {
        return logs.filter(l => {
            const mSearch = l.point.toLowerCase().includes(search.toLowerCase());
            const mFrom = !from || new Date(l.date) >= new Date(from);
            const mTo = !to || new Date(l.date) <= new Date(to);
            const mStatus = statusFilter === 'all' || l.status === statusFilter;
            return mSearch && mFrom && mTo && mStatus;
        });
    }, [logs, search, from, to, statusFilter]);

    const total = logs.length;
    const granted = logs.filter(l => l.status === 'granted').length;
    const denied = total - granted;
    const today = logs.filter(l => l.date === new Date().toLocaleDateString()).length;

    const handleChangePage = (_: any, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    if (loading) {
        return (
            <Box p={isSm ? 2 : 3}>
                <Skeleton
                    variant="rectangular"
                    height={isSm ? 200 : 400}
                    sx={{ borderRadius: 2 }}
                />
            </Box>
        );
    }

    return (
        <Box p={isSm ? 2 : 3}>
            {/* статистика */}
            <Grid container spacing={2} mb={2}>
                {[
                    { label: t('stats.total'), value: total, color: 'primary' as const },
                    { label: t('stats.granted'), value: granted, color: 'success' as const },
                    { label: t('stats.denied'), value: denied, color: 'error' as const },
                    { label: t('stats.today'), value: today, color: 'info' as const },
                ].map(item => (
                    <Grid item xs={6} sm={3} key={item.label}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2,
                                textAlign: 'center',
                                borderRadius: 3,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                {item.label}
                            </Typography>
                            <Typography variant="h4" color={item.color}>
                                {item.value}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* фильтры */}
            <Paper elevation={2} sx={{ mb: 2, borderRadius: 3 }}>
                <Toolbar sx={{ p: isSm ? 1 : 2, gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        size="small"
                        placeholder={t('filter.searchPlaceholder')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        sx={{ minWidth: 220 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label={t('filter.from')}
                        type="date"
                        size="small"
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label={t('filter.to')}
                        type="date"
                        size="small"
                        value={to}
                        onChange={e => setTo(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>{t('filter.status')}</InputLabel>
                        <Select
                            value={statusFilter}
                            label={t('filter.status')}
                            onChange={e => setStatusFilter(e.target.value as any)}
                        >
                            <MenuItem value="all">{t('filter.all')}</MenuItem>
                            <MenuItem value="granted">{t('status.granted')}</MenuItem>
                            <MenuItem value="denied">{t('status.denied')}</MenuItem>
                        </Select>
                    </FormControl>
                </Toolbar>
            </Paper>

            {/* таблица */}
            <Box maxWidth={1200} mx="auto">
                <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 500 }}>
                        <Table size="medium">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: theme.palette.grey[200] }}>
                                    <TableCell sx={{ fontWeight: 'bold', py: 1.5, px: 3 }}>
                                        {t('columns.date')}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', py: 1.5, px: 3 }}>
                                        {t('columns.time')}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', py: 1.5, px: 3 }}>
                                        {t('columns.point')}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', py: 1.5, px: 3 }}>
                                        {t('columns.reason')}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', py: 1.5, px: 3 }}>
                                        {t('columns.status')}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow key="empty">
                                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                            {t('noData')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((l, idx) => (
                                            <TableRow
                                                key={`row-${page * rowsPerPage + idx}`}
                                                hover
                                                sx={{
                                                    '&:nth-of-type(odd)': {
                                                        backgroundColor: theme.palette.action.hover,
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.action.selected,
                                                    },
                                                }}
                                            >
                                                <TableCell sx={{ py: 1.5, px: 3 }}>{l.date}</TableCell>
                                                <TableCell sx={{ py: 1.5, px: 3 }}>{l.time}</TableCell>
                                                <TableCell sx={{ py: 1.5, px: 3 }}>{l.point}</TableCell>
                                                <TableCell sx={{ py: 1.5, px: 3 }}>{l.reason}</TableCell>
                                                <TableCell align="right" sx={{ py: 1.5, px: 3 }}>
                                                    <Chip
                                                        label={t(`status.${l.status}`)}
                                                        color={l.status === 'granted' ? 'success' : 'error'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={filtered.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage={t('pagination.rowsPerPage')}
                        labelDisplayedRows={({ from, to, count }) =>
                            t('pagination.display', { start: from, end: to, total: count })
                        }
                        sx={{
                            '.MuiTablePagination-toolbar': {
                                px: 3,
                                py: 1.5,
                            },
                        }}
                    />
                </Paper>
            </Box>
        </Box>
    );
}
