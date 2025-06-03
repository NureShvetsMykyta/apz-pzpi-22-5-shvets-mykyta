// src/app/user/permissions/PermissionDetailDialog.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    TextField,
    InputAdornment,
    Chip,
    CircularProgress,
    Grid,
    Paper,
    Avatar,
    useTheme,
} from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import api from '@/services/api';
import { Permission } from './PermissionTimeline';

interface Room {
    id: number;
    name: string;
}

interface Props {
    open: boolean;
    permission: Permission | null;
    onClose: () => void;
}

export const PermissionDetailDialog: React.FC<Props> = ({
                                                            open,
                                                            permission,
                                                            onClose,
                                                        }) => {
    const theme = useTheme();
    const { t } = useTranslation('permissions');

    const [rooms, setRooms] = useState<Room[]>([]);
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    // загрузка списка комнат
    useEffect(() => {
        if (!permission) return;
        setLoading(true);
        api
            .get<Room[]>(`/room?zoneType=${encodeURIComponent(permission.zoneType)}`)
            .then(({ data }) => {
                setRooms(data);
                setFilteredRooms(data);
            })
            .catch(() => {
                setRooms([]);
                setFilteredRooms([]);
            })
            .finally(() => setLoading(false));
    }, [permission]);

    // локальный фильтр по имени
    useEffect(() => {
        const term = search.trim().toLowerCase();
        setFilteredRooms(rooms.filter(r => r.name.toLowerCase().includes(term)));
    }, [search, rooms]);

    if (!permission) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ p: 0 }}>
                <Box
                    display="flex"
                    alignItems="center"
                    backgroundColor={theme.palette.background.paper}
                    p={2}
                >
                    <Avatar
                        sx={{
                            bgcolor: theme.palette.primary.main,
                            width: 56,
                            height: 56,
                            mr: 2,
                        }}
                    >
                        {permission.zoneType.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box flex={1}>
                        <Typography variant="h6">{permission.zoneType}</Typography>
                        <Box display="flex" alignItems="center" mt={0.5}>
                            <AccessTimeIcon
                                fontSize="small"
                                sx={{ color: 'text.secondary', mr: 0.5 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                {permission.schedule}
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        label={t(`card.status.${permission.status}`)}
                        color={permission.status === 'granted' ? 'success' : 'error'}
                        sx={{ ml: 1 }}
                    />
                </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ pt: 2 }}>
                {/* Поиск по комнатам */}
                <Box display="flex" alignItems="center" mb={2}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder={t('details.searchPlaceholder')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Состояние загрузки или грида */}
                {loading ? (
                    <Box display="flex" justifyContent="center" py={6}>
                        <CircularProgress size={32} />
                    </Box>
                ) : filteredRooms.length > 0 ? (
                    <Grid container spacing={2}>
                        {filteredRooms.map(room => (
                            <Grid item xs={12} sm={6} md={4} key={room.id}>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        borderRadius: 2,
                                        transition: 'box-shadow .2s',
                                        '&:hover': {
                                            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                                        },
                                    }}
                                >
                                    <MeetingRoomIcon color="primary" />
                                    <Typography noWrap>{room.name}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography
                        color="text.secondary"
                        sx={{ mt: 4, textAlign: 'center' }}
                    >
                        {t('details.noRooms')}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 1 }}>
                <Button onClick={onClose} variant="contained">
                    {t('details.close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
