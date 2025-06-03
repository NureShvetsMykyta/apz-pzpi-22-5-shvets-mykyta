// src/app/user/layout.tsx
'use client';

import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Sidebar, NavItem } from '@/components/common/Sidebar';
import { Header } from '@/components/common/Header';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

import HomeIcon    from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import VpnKeyIcon  from '@mui/icons-material/VpnKey';
import SettingsIcon from '@mui/icons-material/Settings';

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (loading) return;
        if (!user) {
            router.replace('/auth/login');
        } else if (['Admin', 'SuperAdmin'].includes(user.role)) {
            router.replace('/admin/dashboard');
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <Box
                sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}
            >
                <CircularProgress />
            </Box>
        );
    }

    const navItems: NavItem[] = [
        { labelKey: 'home',        icon: <HomeIcon />,      path: '/user/dashboard'   },
        { labelKey: 'history',     icon: <HistoryIcon />,   path: '/user/history'     },
        { labelKey: 'permissions', icon: <VpnKeyIcon />,    path: '/user/permissions' },
        { labelKey: 'settings',    icon: <SettingsIcon />,   path: '/user/settings'    },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar items={navItems} />

            <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
                <Header />
                { }
                <Box sx={{ height: 64 }} />

                <Box component="main" sx={{ p: 3 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
