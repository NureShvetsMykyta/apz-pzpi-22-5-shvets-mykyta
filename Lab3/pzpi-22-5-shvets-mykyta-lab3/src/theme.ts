// src/theme.ts
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#1e293b",       // глибокий темно-синій для сайдбару
            contrastText: "#fff",
        },
        background: {
            default: "#f3f4f6",    // світло-сірий фон
            paper: "#ffffff",
        },
        text: {
            primary: "#111827",    // темний майже чорний
            secondary: "#6b7280",  // сірий субтекст
        },
        success: { main: "#16a34a" },
        error:   { main: "#dc2626" },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: `"Inter", sans-serif`,
        h6: { fontWeight: 600, fontSize: "1.25rem" },
        subtitle2: { color: "#6b7280" },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    margin: 0,
                    padding: 0,
                    boxSizing: "border-box",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    borderRadius: 12,
                },
            },
        },
    },
});