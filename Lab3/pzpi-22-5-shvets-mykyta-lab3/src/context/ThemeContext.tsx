// src/context/ThemeContext.tsx
'use client';
import React, {
    createContext,
    useState,
    useMemo,
    useContext,
    ReactNode,
    useEffect,
} from 'react';
import { ThemeProvider, createTheme, PaletteMode } from '@mui/material';

// 1. Контекст
interface IThemeContext {
    mode: PaletteMode;
    toggleMode: () => void;
}
const ThemeContext = createContext<IThemeContext>({
    mode: 'light',
    toggleMode: () => {},
});

// 2. Провайдер
export function CustomThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<PaletteMode>('light');

    // читаем из localStorage
    useEffect(() => {
        const stored = localStorage.getItem('mode') as PaletteMode;
        if (stored === 'light' || stored === 'dark') {
            setMode(stored);
        }
    }, []);

    const toggleMode = () => {
        setMode(prev => {
            const next = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('mode', next);
            return next;
        });
    };

    // 3. Переопределим цвета по mode
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main:
                            mode === 'light'
                                ? '#0d1b2a' // ваш обычный тёмно-синий
                                : '#08121d', // более тёмный вариант для dark
                        contrastText: '#fff',
                    },
                    secondary: {
                        main:
                            mode === 'light'
                                ? '#4a90e2'
                                : '#2a5080',
                    },
                    background: {
                        default: mode === 'light' ? '#f5f7fa' : '#121212',
                        paper: mode === 'light' ? '#fff' : '#1e1e1e',
                    },
                    divider: mode === 'light' ? '#e0e0e0' : '#333',
                    text: {
                        primary: mode === 'light' ? '#1a1a1a' : '#eaeaea',
                        secondary: mode === 'light' ? '#555' : '#aaa',
                    },
                },
                shape: { borderRadius: 12 },
                components: {
                    MuiAppBar: {
                        styleOverrides: {
                            colorPrimary: {
                                backgroundColor:
                                    mode === 'light' ? '#0d1b2a' : '#08121d',
                            },
                        },
                    },
                },
            }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={{ mode, toggleMode }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    return useContext(ThemeContext);
}
