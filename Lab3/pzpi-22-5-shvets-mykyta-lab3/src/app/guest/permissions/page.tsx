// src/app/guest/permissions/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Chip,
    CircularProgress,
    useTheme,
    useMediaQuery,
    styled
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface RawRule {
    id: number;
    zoneType: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    hasAccess: boolean;
}

interface Rule {
    id: number;
    zone: string;
    schedule: string;
    status: 'granted' | 'denied';
}

// Обёртка всей страницы с фоновым градиентом
const Hero = styled(Box)(({ theme }) => ({
    background: `linear-gradient(120deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.common.white,
    padding: theme.spacing(6, 2),
    textAlign: 'center'
}));

// Сетка карточек
const CardsGrid = styled(Grid)(({ theme }) => ({
    marginTop: -theme.spacing(4),    // «подняли» сетку, чтобы немного заходила на градиент
    padding: theme.spacing(0, 2, 4)
}));

// Оформление карточки
const CardPaper = styled(Paper)<{ status: 'granted' | 'denied' }>(
    ({ theme, status }) => ({
        position: 'relative',
        padding: theme.spacing(4),
        height: '100%',
        boxShadow: theme.shadows[2],
        borderRadius: theme.shape.borderRadius * 2,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        borderLeft: `8px solid ${
            status === 'granted' ? theme.palette.success.main : theme.palette.error.main
        }`,
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: theme.shadows[6]
        }
    })
);

export default function GuestPermissionsPage() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('md'));

    const [rules, setRules] = useState<Rule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { data } = await api.get<RawRule[]>('/accessrule/my');
                const mapped: Rule[] = data.map(r => {
                    const parts: string[] = [];
                    if (r.startDate && r.endDate) {
                        parts.push(
                            `${new Date(r.startDate).toLocaleDateString()} – ${new Date(
                                r.endDate
                            ).toLocaleDateString()}`
                        );
                    }
                    if (r.startTime && r.endTime) {
                        parts.push(
                            `${r.startTime.slice(0, 5)} – ${r.endTime.slice(0, 5)}`
                        );
                    }
                    return {
                        id: r.id,
                        zone: r.zoneType,
                        schedule: parts.join(' | ') || '—',
                        status: r.hasAccess ? 'granted' : 'denied'
                    };
                });
                setRules(mapped);
            } catch {
                setRules([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    height: '60vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!rules.length) {
        return (
            <Box sx={{ textAlign: 'center', mt: 8 }}>
                <Typography variant="h6" color="text.secondary">
                    No access permissions found.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Hero>
                <Typography variant={isSm ? 'h4' : 'h3'} gutterBottom>
                    Your Guest Access Permissions
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: 600, margin: '0 auto' }}>
                    As a guest, you have the following access rights. Cards highlighted green indicate granted access; red — access denied.
                </Typography>
            </Hero>

            <CardsGrid container spacing={3} justifyContent="center">
                {rules.map(rule => (
                    <Grid item key={rule.id} xs={12} sm={6} md={4} lg={3}>
                        <CardPaper status={rule.status}>
                            <Typography variant="h6" gutterBottom>
                                {rule.zone}
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: theme.palette.text.secondary,
                                    mb: 2
                                }}
                            >
                                <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body2">{rule.schedule}</Typography>
                            </Box>

                            <Chip
                                label={rule.status === 'granted' ? 'Granted' : 'Denied'}
                                color={rule.status === 'granted' ? 'success' : 'error'}
                                size="small"
                            />
                        </CardPaper>
                    </Grid>
                ))}
            </CardsGrid>
        </Box>
    );
}
