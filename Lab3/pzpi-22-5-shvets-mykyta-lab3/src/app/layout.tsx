// src/app/layout.tsx
'use client';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import CssBaseline from '@mui/material/CssBaseline';
import { CustomThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <I18nextProvider i18n={i18n}>
            <CustomThemeProvider>
                <CssBaseline />
                <AuthProvider>
                    {children}
                </AuthProvider>
            </CustomThemeProvider>
        </I18nextProvider>
        </body>
        </html>
    );
}
