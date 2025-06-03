// src/app/auth/login/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Drawer,
    Backdrop,
    Box,
    IconButton,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();

    useEffect(() => {
        // при монтировании открываем Drawer
        setOpen(true);
    }, []);

    const handleClose = () => {
        setOpen(false);
        // возвращаем на главную
        router.replace('/');
    };

    return (
        <>
            {/* затемнённый фон поверх HomePage */}
            <Backdrop
                open={open}
                sx={{ zIndex: theme.zIndex.drawer - 1 }}
                onClick={handleClose}
            />

            {/* Drawer с формой логина */}
            <Drawer
                anchor="right"
                open={open}
                onClose={handleClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: isSm ? '100%' : 360,
                        p: 3,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ mt: 1 }}>
                    <LoginForm />
                </Box>
            </Drawer>
        </>
    );
}
