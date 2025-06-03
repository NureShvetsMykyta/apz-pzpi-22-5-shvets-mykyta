"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Paper,
    Typography,
    Stack,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Autocomplete,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const API_BASE = "https://localhost:7258";

interface User {
    id: number;
    firstName: string;
    lastName: string;
}
interface AccessPoint {
    id: number;
    identifier: string;
}

export default function ReportsPage() {
    const [loading, setLoading]       = useState(true);
    const [users, setUsers]           = useState<User[]>([]);
    const [aps, setAps]               = useState<AccessPoint[]>([]);

    const [from, setFrom]             = useState<Date | null>(null);
    const [to, setTo]                 = useState<Date | null>(null);
    const [status, setStatus]         = useState<""|"0"|"1">("");
    const [selectedUser, setSelectedUser] = useState<User|null>(null);
    const [selectedAp, setSelectedAp]     = useState<AccessPoint|null>(null);
    const [format, setFormat]         = useState<"pdf"|"excel"|"word">("pdf");

    // preview
    const [previewUrl, setPreviewUrl] = useState<string|null>(null);
    const [mimeType, setMimeType]     = useState<string|null>(null);
    const [busy, setBusy]             = useState(false);

    useEffect(() => {
        Promise.all([
            axios.get<User[]>(`${API_BASE}/api/user/all`),
            axios.get<AccessPoint[]>(`${API_BASE}/api/access-point`),
        ])
            .then(([uRes, apRes]) => {
                setUsers(uRes.data);
                setAps(apRes.data);
            })
            .catch((err) => {
                console.error("Failed to fetch filter options:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleGenerate = async () => {
        setBusy(true);
        setPreviewUrl(null);
        setMimeType(null);

        const qs = new URLSearchParams();
        if (from)           qs.set("from", from.toISOString());
        if (to)             qs.set("to",   to.toISOString());
        if (status)         qs.set("status", status);
        if (selectedUser)   qs.set("userId", String(selectedUser.id));
        if (selectedAp)     qs.set("accessPointId", String(selectedAp.id));
        qs.set("type", format);

        try {
            const resp = await axios.get(
                `${API_BASE}/api/report/access-logs?${qs.toString()}`,
                { responseType: "blob" }
            );
            const blob = resp.data as Blob;
            const url  = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setMimeType(resp.headers["content-type"] || blob.type);
        } catch(err) {
            console.error("Generate failed:", err);
        } finally {
            setBusy(false);
        }
    };

    if (loading) {
        return (
            <Box height="60vh" display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={4} display="flex" gap={3} height="calc(100vh - 64px - 32px)">
            { }
            <Paper
                elevation={4}
                sx={{
                    width: 360,
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    bgcolor: "background.paper",
                }}
            >
                <Typography variant="h6" gutterBottom>Report Filters</Typography>
                <Stack spacing={2} flexGrow={1}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="From"
                            value={from}
                            onChange={setFrom}
                            slotProps={{ textField: { fullWidth: true, size: "small" } }}
                        />
                        <DatePicker
                            label="To"
                            value={to}
                            onChange={setTo}
                            slotProps={{ textField: { fullWidth: true, size: "small" } }}
                        />
                    </LocalizationProvider>

                    <FormControl fullWidth size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                            label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="0">Granted</MenuItem>
                            <MenuItem value="1">Denied</MenuItem>
                        </Select>
                    </FormControl>

                    <Autocomplete
                        options={users}
                        getOptionLabel={(u) => `${u.firstName} ${u.lastName}`}
                        value={selectedUser}
                        onChange={(_,v) => setSelectedUser(v)}
                        renderInput={(params) => (
                            <TextField {...params} label="User" size="small" fullWidth />
                        )}
                    />

                    <Autocomplete
                        options={aps}
                        getOptionLabel={(a) => a.identifier}
                        value={selectedAp}
                        onChange={(_,v) => setSelectedAp(v)}
                        renderInput={(params) => (
                            <TextField {...params} label="Access Point" size="small" fullWidth />
                        )}
                    />

                    <FormControl fullWidth size="small">
                        <InputLabel>Format</InputLabel>
                        <Select
                            label="Format"
                            value={format}
                            onChange={(e) => setFormat(e.target.value as any)}
                        >
                            <MenuItem value="pdf">PDF</MenuItem>
                            <MenuItem value="excel">Excel</MenuItem>
                            <MenuItem value="word">Word</MenuItem>
                        </Select>
                    </FormControl>

                    <Box mt="auto">
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handleGenerate}
                            disabled={busy}
                        >
                            {busy ? "Generating…" : "Generate Report"}
                        </Button>
                    </Box>
                </Stack>
            </Paper>

            { }
            <Paper
                elevation={4}
                sx={{
                    flexGrow: 1,
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    bgcolor: "background.paper",
                }}
            >
                <Typography variant="h6" gutterBottom>Preview / Download</Typography>
                <Box
                    flexGrow={1}
                    sx={{
                        position: "relative",
                        border: "2px dashed",
                        borderColor: "grey.300",
                        borderRadius: 1,
                        overflow: "hidden",
                    }}
                >
                    { }
                    {previewUrl && mimeType === "application/pdf" && (
                        <iframe
                            src={previewUrl}
                            style={{ width: "100%", height: "100%", border: 0 }}
                        />
                    )}

                    { }
                    {previewUrl && mimeType !== "application/pdf" && (
                        <Box
                            height="100%"
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography mb={2}>
                                Preview not supported for this format.
                            </Typography>
                            <Button
                                variant="outlined"
                                href={previewUrl}
                                download={`report.${format === "excel" ? "xlsx" : "docx"}`}
                                target="_blank"
                            >
                                Download {format.toUpperCase()}
                            </Button>
                        </Box>
                    )}

                    { }
                    {!previewUrl && !busy && (
                        <Box
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography color="textSecondary">
                                Click “Generate Report” to see preview or download link.
                            </Typography>
                        </Box>
                    )}

                    { }
                    {busy && (
                        <Box
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <CircularProgress />
                        </Box>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}
