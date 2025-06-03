'use client';

import React, { useEffect } from 'react';
import { Box, CircularProgress, Toolbar as MuiToolbar } from '@mui/material';
import { Sidebar, NavItem } from '@/components/common/Sidebar';
import { Header } from '@/components/common/Header';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

import DashboardIcon   from '@mui/icons-material/Dashboard';
import PeopleIcon      from '@mui/icons-material/People';
import ApartmentIcon   from '@mui/icons-material/Apartment';
import VpnKeyIcon      from '@mui/icons-material/VpnKey';
import HistoryIcon     from '@mui/icons-material/History';
import GavelIcon       from '@mui/icons-material/Gavel';
import BarChartIcon    from '@mui/icons-material/BarChart';
import AnalyticsIcon   from '@mui/icons-material/Analytics';
import SettingsIcon    from '@mui/icons-material/Settings';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    const isAllowed = !!user && ['Admin', 'SuperAdmin'].includes(user.role);

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.replace('/auth/login');
        } else if (!isAllowed) {
            router.replace('/user/dashboard');
        }
    }, [loading, user, isAllowed, router]);

    if (loading || !isAllowed) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    height: '100vh',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    const adminNavItems: NavItem[] = [
        { labelKey: 'dashboard',     icon: <DashboardIcon />,   path: '/admin/dashboard'     },
        { labelKey: 'users',         icon: <PeopleIcon />,      path: '/admin/users'         },
        { labelKey: 'campus',        icon: <ApartmentIcon />,   path: '/admin/campus'        },
        { labelKey: 'accessPoints',  icon: <VpnKeyIcon />,      path: '/admin/access-points' },
        { labelKey: 'accessLogs',    icon: <HistoryIcon />,     path: '/admin/access-logs'   },
        { labelKey: 'accessRules',   icon: <GavelIcon />,       path: '/admin/access-rules'  },
        { labelKey: 'reports',       icon: <BarChartIcon />,    path: '/admin/reports'       },
        { labelKey: 'analytics',     icon: <AnalyticsIcon />,   path: '/admin/analytics'     },
        { labelKey: 'settings',      icon: <SettingsIcon />,    path: '/admin/settings'      },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            { }
            <Sidebar items={adminNavItems} />

            <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
                { }
                <Header />

                { }
                <MuiToolbar variant="dense" />

                <Box component="main" sx={{ p: 3 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
