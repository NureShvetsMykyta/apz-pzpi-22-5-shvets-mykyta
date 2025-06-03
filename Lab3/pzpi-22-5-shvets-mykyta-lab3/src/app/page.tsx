// src/app/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';         // ← не забыть
import {
    Box,
    Container,
    Typography,
    Button,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import HistoryIcon from '@mui/icons-material/History';
import BarChartIcon from '@mui/icons-material/BarChart';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
} from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'));
    const { t } = useTranslation('home');
    const { loginAsGuest } = useAuth();
    const router = useRouter();                      // ← здесь

    // при клике гостем — ставим роль Guest и идём на страницу только с его разрешениями
    const handleGuest = () => {
        loginAsGuest();
        router.push('/guest/permissions');           // ← поменяли путь
    };

    const features = [
        {
            key: 'manageAccess',
            icon: <VpnKeyIcon fontSize="small" />,
            title: t('features.manageAccess.title'),
            description: t('features.manageAccess.description'),
        },
        {
            key: 'viewPermissions',
            icon: <LockOpenIcon fontSize="small" />,
            title: t('features.viewPermissions.title'),
            description: t('features.viewPermissions.description'),
        },
        {
            key: 'accessHistory',
            icon: <HistoryIcon fontSize="small" />,
            title: t('features.accessHistory.title'),
            description: t('features.accessHistory.description'),
        },
        {
            key: 'analytics',
            icon: <BarChartIcon fontSize="small" />,
            title: t('features.analytics.title'),
            description: t('features.analytics.description'),
        },
    ];

    const year = new Date().getFullYear();

    return (
        <Box>
            {/* Hero */}
            <Box
                sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.common.white,
                    py: { xs: 8, md: 12 },
                }}
            >
                <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" gutterBottom>
                        {t('hero.title')}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4 }}>
                        {t('hero.subtitle')}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Button
                            component={Link}
                            href="/auth/login"
                            variant="contained"
                            size="large"
                        >
                            {t('hero.login')}
                        </Button>
                        <Button
                            onClick={handleGuest}
                            variant="outlined"
                            size="large"
                            sx={{
                                borderColor: theme.palette.common.white,
                                color: theme.palette.common.white,
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    borderColor: theme.palette.common.white,
                                },
                            }}
                        >
                            {t('hero.continueGuest')}
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Features as Timeline */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Typography variant="h4" align="center" gutterBottom>
                    {t('featuresTitle', 'Features')}
                </Typography>
                <Timeline
                    position={isMd ? 'alternate' : 'right'}
                    sx={{
                        '& .MuiTimelineConnector-root': { bgcolor: 'grey.300' },
                        '& .MuiTimelineDot-root': {
                            bgcolor: 'primary.main',
                            color: '#fff',
                        },
                    }}
                >
                    {features.map((f, idx) => (
                        <TimelineItem key={f.key}>
                            {isMd && (
                                <TimelineOppositeContent
                                    sx={{ m: 'auto 0' }}
                                    align={idx % 2 === 0 ? 'right' : 'left'}
                                />
                            )}
                            <TimelineSeparator>
                                <TimelineDot>{f.icon}</TimelineDot>
                                {idx < features.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Typography variant="h6">{f.title}</Typography>
                                <Typography color="text.secondary">
                                    {f.description}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            </Container>

            {/* Support */}
            <Box
                sx={{
                    bgcolor: theme.palette.grey[50],
                    py: { xs: 6, md: 8 },
                }}
            >
                <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
                    <SupportAgentIcon fontSize="large" color="primary" />
                    <Typography variant="h5" gutterBottom mt={2}>
                        {t('support.title')}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {t('support.contact')}
                    </Typography>
                    <Typography variant="body2">
                        <strong>{t('support.emailLabel')}</strong>{' '}
                        <a href={`mailto:${t('support.email')}`}>{t('support.email')}</a>
                    </Typography>
                    <Typography variant="body2">
                        <strong>{t('support.phoneLabel')}</strong>{' '}
                        <a href={`tel:${t('support.phone')}`}>{t('support.phone')}</a>
                    </Typography>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ py: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    {t('footer.rights', { year })}
                </Typography>
            </Box>
        </Box>
    );
}
