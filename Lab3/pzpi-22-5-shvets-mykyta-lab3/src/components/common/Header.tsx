// src/components/common/Header.tsx
'use client';

import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Avatar,
    useTheme,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { drawerWidth } from '@/components/common/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
    title?: string;
}

export function Header({ title }: HeaderProps) {
    const theme = useTheme();
    const { user, logout } = useAuth();
    const router = useRouter();
    const { t } = useTranslation('header');

    const handleLogout = () => {
        logout();
        router.replace('/auth/login');
    };

    const appTitle = title ?? t('appTitle');
    const displayName =
        user?.role === 'SuperAdmin'
            ? t('superAdmin')
            : user?.firstName ?? '';

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                ml: `${drawerWidth}px`,
                width: `calc(100% - ${drawerWidth}px)`,
                zIndex: theme.zIndex.drawer + 1,
                bgcolor: 'background.paper',
                color: 'text.primary',
                borderBottom: '1px solid #e5e7eb',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
                <Typography variant="h6" noWrap>
                    {appTitle}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ mr: 2 }} noWrap>
                        {displayName}
                    </Typography>
                    <Avatar sx={{ bgcolor: 'primary.main', color: '#fff', mr: 2 }}>
                        {user?.firstName?.[0] ?? user?.email?.[0] ?? ''}
                    </Avatar>
                    <IconButton onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
