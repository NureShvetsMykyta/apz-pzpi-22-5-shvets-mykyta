// src/app/auth/layout.tsx
'use client';

import React from 'react';
import HomePage from '../page';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {}
            <HomePage />
            {}
            {children}
        </>
    );
}
