// src/components/common/Sidebar.tsx
'use client';

import React from 'react';
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Box,
    useTheme,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export interface NavItem {
    labelKey: string;
    icon: React.ReactNode;
    path: string;
}

export const drawerWidth = 260;

export function Sidebar({ items }: { items: NavItem[] }) {
    const theme = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useTranslation('sidebar');

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRight: 'none',
                    zIndex: theme.zIndex.drawer,
                },
            }}
        >
            { }
            <Toolbar sx={{ minHeight: 64, justifyContent: 'center' }}>
                <SchoolIcon sx={{ fontSize: 40, color: 'white' }} />
            </Toolbar>

            <Box sx={{ overflow: 'auto', mt: 2 }}>
                <List>
                    {items.map((item) => (
                        <ListItemButton
                            key={item.path}
                            selected={pathname === item.path}
                            onClick={() => router.push(item.path)}
                            sx={{
                                mb: 1,
                                '&.Mui-selected': {
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={t(item.labelKey)} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}
