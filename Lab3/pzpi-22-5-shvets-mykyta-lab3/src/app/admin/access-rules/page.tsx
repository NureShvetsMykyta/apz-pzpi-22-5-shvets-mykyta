"use client";

import React, { useState, useEffect } from "react";
import api from "@/services/api";
import {
    Box,
    Card,
    Typography,
    Grid,
    TextField,
    MenuItem,
    FormControlLabel,
    Switch,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Alert,
    useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon        from "@mui/icons-material/Add";
import EditIcon       from "@mui/icons-material/Edit";
import DeleteIcon     from "@mui/icons-material/Delete";
import {
    LocalizationProvider,
    DatePicker,
    TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const roleMap: Record<AppUserRole, number> = {
    SuperAdmin: 0,
    Admin:      1,
    Security:   2,
    Staff:      3,
    Student:    4,
    Guest:      5,
};
const zoneMap: Record<CampusZoneType, number> = {
    Auditorium:  0,
    Laboratory:  1,
    Office:      2,
    Lounge:      3,
    Library:     4,
    Gym:         5,
    Cafeteria:   6,
    AdminArea:   7,
    CommonArea:  8,
    Parking:     9,
    Outdoor:    10,
    Other:      11,
};

type AppUserRole =
    | "SuperAdmin"
    | "Admin"
    | "Security"
    | "Staff"
    | "Student"
    | "Guest";

type CampusZoneType =
    | "Auditorium"
    | "Laboratory"
    | "Office"
    | "Lounge"
    | "Library"
    | "Gym"
    | "Cafeteria"
    | "AdminArea"
    | "CommonArea"
    | "Parking"
    | "Outdoor"
    | "Other";

interface AccessRuleResponse {
    id: number;
    userRole: AppUserRole;
    zoneType: CampusZoneType;
    hasAccess: boolean;
    startTime: string | null;   // "HH:mm:ss"
    endTime:   string | null;
    startDate: string | null;   // ISO date
    endDate:   string | null;
    createdAt: string;          // ISO datetime
    updatedAt: string | null;   // ISO datetime or null
}

export default function AccessRulesPage() {
    const theme = useTheme();

    const [userRole,  setUserRole]  = useState<AppUserRole | "">("");
    const [zoneType,  setZoneType]  = useState<CampusZoneType | "">("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate,   setEndDate]   = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime,   setEndTime]   = useState<Date | null>(null);

    const [rules,    setRules]   = useState<AccessRuleResponse[]>([]);
    const [loading,  setLoading] = useState(false);
    const [error,    setError]   = useState<string | null>(null);

    const [dialogOpen,  setDialogOpen]  = useState(false);
    const [editingRule, setEditingRule] =
        useState<Partial<AccessRuleResponse> | null>(null);

    const [confirmOpen, setConfirmOpen]   = useState(false);
    const [ruleToDelete, setRuleToDelete] = useState<number | null>(null);

    const fetchRules = async () => {
        setLoading(true);
        setError(null);
        try {
            const params: Record<string, any> = {};
            if (userRole)  params.userRole  = roleMap[userRole];
            if (zoneType)  params.zoneType  = zoneMap[zoneType];
            if (startDate) params.startDate = startDate.toISOString();
            if (endDate)   params.endDate   = endDate.toISOString();
            if (startTime) params.startTime = startTime.toTimeString().slice(0,8);
            if (endTime)   params.endTime   = endTime.toTimeString().slice(0,8);

            const { data } = await api.get<AccessRuleResponse[]>("/accessrule", { params });
            setRules(data);
        } catch (e: any) {
            console.error(e);
            const msg = e.response?.data?.errors
                ? JSON.stringify(e.response.data.errors)
                : e.message;
            setError("Error loading rules: " + msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRules(); }, []);

    const onApply = () => fetchRules();
    const onReset = () => {
        setUserRole("");
        setZoneType("");
        setStartDate(null);
        setEndDate(null);
        setStartTime(null);
        setEndTime(null);
        fetchRules();
    };

    const openCreate = () => {
        setEditingRule({
            userRole:  "" as any,
            zoneType:  "" as any,
            hasAccess: false,
            startTime: "00:00:00",
            endTime:   "23:59:59",
            startDate: null,
            endDate:   null,
        });
        setDialogOpen(true);
    };
    const openEdit = (r: AccessRuleResponse) => {
        setEditingRule({ ...r });
        setDialogOpen(true);
    };
    const closeDialog = () => setDialogOpen(false);

    const saveRule = async () => {
        if (!editingRule) return;
        if (!editingRule.userRole || !editingRule.zoneType) {
            alert("User Role and Zone Type are required");
            return;
        }
        if (
            editingRule.startDate && editingRule.endDate &&
            new Date(editingRule.startDate) > new Date(editingRule.endDate)
        ) {
            alert("Start Date must be ≤ End Date");
            return;
        }
        if (
            editingRule.startTime && editingRule.endTime &&
            editingRule.startTime > editingRule.endTime
        ) {
            alert("Start Time must be ≤ End Time");
            return;
        }

        const payload = {
            userRole:  roleMap[editingRule.userRole as AppUserRole],
            zoneType:  zoneMap[editingRule.zoneType as CampusZoneType],
            hasAccess: !!editingRule.hasAccess,
            startTime: editingRule.startTime,
            endTime:   editingRule.endTime,
            startDate: editingRule.startDate,
            endDate:   editingRule.endDate,
        };

        try {
            if (editingRule.id) {
                await api.put(`/accessrule/${editingRule.id}`, payload);
            } else {
                await api.post("/accessrule", payload);
            }
            closeDialog();
            await fetchRules();
        } catch (e: any) {
            console.error(e);
            const msg = e.response?.data?.errors
                ? JSON.stringify(e.response.data.errors)
                : e.message;
            setError("Error saving rule: " + msg);
        }
    };

    const openConfirm = (id: number) => {
        setRuleToDelete(id);
        setConfirmOpen(true);
    };
    const closeConfirm = () => {
        setConfirmOpen(false);
        setRuleToDelete(null);
    };
    const handleDelete = async () => {
        if (ruleToDelete == null) return;
        try {
            await api.delete(`/accessrule/${ruleToDelete}`);
            closeConfirm();
            await fetchRules();
        } catch (e: any) {
            console.error(e);
            setError("Error deleting rule: " + e.message);
        }
    };

    const grouped = rules.reduce<Record<string,AccessRuleResponse[]>>((acc,r)=>{
        const key = r.zoneType || "All Zones";
        (acc[key] = acc[key]||[]).push(r);
        return acc;
    }, {});

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box p={4}>
                {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}

                {/* FILTER PANEL */}
                <Card
                    variant="outlined"
                    sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                    }}
                >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box
                            sx={{
                                display: "grid",
                                gap: 2,
                                alignItems: "center",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(3, 1fr)",
                                    md: "140px 140px 150px 150px 130px 130px auto",
                                },
                            }}
                        >
                            {/* 1. User Role */}
                            <TextField
                                select
                                size="small"
                                fullWidth
                                label="User Role"
                                value={userRole}
                                onChange={(e) => setUserRole(e.target.value as AppUserRole)}
                            >
                                <MenuItem value="">All</MenuItem>
                                {(Object.keys(roleMap) as AppUserRole[]).map((r) => (
                                    <MenuItem key={r} value={r}>
                                        {r}
                                    </MenuItem>
                                ))}
                            </TextField>

                            {/* 2. Zone Type */}
                            <TextField
                                select
                                size="small"
                                fullWidth
                                label="Zone Type"
                                value={zoneType}
                                onChange={(e) => setZoneType(e.target.value as CampusZoneType)}
                            >
                                <MenuItem value="">All</MenuItem>
                                {(Object.keys(zoneMap) as CampusZoneType[]).map((z) => (
                                    <MenuItem key={z} value={z}>
                                        {z}
                                    </MenuItem>
                                ))}
                            </TextField>

                            {/* 3. Start Date */}
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={setStartDate}
                                renderInput={(params) => (
                                    <TextField {...params} size="small" fullWidth />
                                )}
                            />

                            {/* 4. End Date */}
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={setEndDate}
                                renderInput={(params) => (
                                    <TextField {...params} size="small" fullWidth />
                                )}
                            />

                            {/* 5. Start Time */}
                            <TimePicker
                                label="Start Time"
                                value={startTime}
                                onChange={setStartTime}
                                renderInput={(params) => (
                                    <TextField {...params} size="small" fullWidth />
                                )}
                            />

                            {/* 6. End Time */}
                            <TimePicker
                                label="End Time"
                                value={endTime}
                                onChange={setEndTime}
                                renderInput={(params) => (
                                    <TextField {...params} size="small" fullWidth />
                                )}
                            />

                            {/* 7. Apply / Reset */}
                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" onClick={onApply}>
                                    Apply
                                </Button>
                                <Button variant="outlined" onClick={onReset}>
                                    Reset
                                </Button>
                            </Stack>
                        </Box>
                    </LocalizationProvider>
                </Card>

                { }
                <Box sx={{ textAlign: "right", mb: 4 }}>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={openCreate}>
                        Add Rule
                    </Button>
                </Box>

                {/* RULE LIST */}
                {loading
                    ? <Typography>Loading…</Typography>
                    : Object.entries(grouped).map(([zone,list],i)=>(
                        <Accordion key={`${zone}-${i}`} defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography fontWeight="bold">
                                    {zone} ({list.length})
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>User Role</TableCell>
                                            <TableCell>Has Access</TableCell>
                                            <TableCell>Time Range</TableCell>
                                            <TableCell>Date Range</TableCell>
                                            <TableCell>Created At</TableCell>
                                            <TableCell>Updated At</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {list.map(r=>{
                                            const dtCreated = new Date(r.createdAt);
                                            const dtUpdated = r.updatedAt
                                                ? new Date(r.updatedAt)
                                                : null;
                                            return (
                                                <TableRow key={r.id}>
                                                    <TableCell>{r.userRole}</TableCell>
                                                    <TableCell>
                                                        {r.hasAccess
                                                            ? <Typography color="success.main">✔</Typography>
                                                            : <Typography color="error.main">✖</Typography>}
                                                    </TableCell>
                                                    <TableCell>
                                                        {r.startTime?.slice(0,5) ?? "—"} /{" "}
                                                        {r.endTime?.slice(0,5)   ?? "—"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {r.startDate?.split("T")[0] ?? "—"} —{" "}
                                                        {r.endDate?.split("T")[0]   ?? "—"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {isNaN(dtCreated.getTime())
                                                            ? "—"
                                                            : dtCreated.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {dtUpdated && !isNaN(dtUpdated.getTime())
                                                            ? dtUpdated.toLocaleString()
                                                            : "—"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton size="small" onClick={()=>openEdit(r)}>
                                                            <EditIcon fontSize="small"/>
                                                        </IconButton>
                                                        <IconButton size="small" onClick={()=>openConfirm(r.id!)}>
                                                            <DeleteIcon fontSize="small"/>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>
                    ))
                }

                {/* EDIT / CREATE DIALOG */}
                <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingRule?.id ? "Edit Access Rule" : "New Access Rule"}
                    </DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} mt={1}>
                            <TextField
                                select size="small" label="User Role"
                                value={editingRule?.userRole ?? ""}
                                onChange={e=>
                                    setEditingRule(r=>({...r!,userRole:e.target.value as AppUserRole}))
                                }
                            >
                                {(Object.keys(roleMap) as AppUserRole[]).map(r=>(
                                    <MenuItem key={r} value={r}>{r}</MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select size="small" label="Zone Type"
                                value={editingRule?.zoneType ?? ""}
                                onChange={e=>
                                    setEditingRule(r=>({...r!,zoneType:e.target.value as CampusZoneType}))
                                }
                            >
                                {(Object.keys(zoneMap) as CampusZoneType[]).map(z=>(
                                    <MenuItem key={z} value={z}>{z}</MenuItem>
                                ))}
                            </TextField>
                            <FormControlLabel
                                control={

                                    <Switch
                                        checked={!!editingRule?.hasAccess}
                                        onChange={(_,v)=>setEditingRule(r=>({...r!,hasAccess:v}))}
                                    />
                                }
                                label="Has Access"
                            />
                            <TimePicker
                                label="Start Time"
                                value={editingRule?.startTime
                                    ? new Date(`1970-01-01T${editingRule.startTime}`)
                                    : null}
                                onChange={d=>
                                    setEditingRule(r=>({...r!,startTime:d?.toTimeString().slice(0,8) ?? null}))
                                }
                                renderInput={p=><TextField {...p} size="small"/>}
                            />
                            <TimePicker
                                label="End Time"
                                value={editingRule?.endTime
                                    ? new Date(`1970-01-01T${editingRule.endTime}`)
                                    : null}
                                onChange={d=>
                                    setEditingRule(r=>({...r!,endTime:d?.toTimeString().slice(0,8) ?? null}))
                                }
                                renderInput={p=><TextField {...p} size="small"/>}
                            />
                            <DatePicker
                                label="Start Date"
                                value={editingRule?.startDate ? new Date(editingRule.startDate) : null}
                                onChange={d=>
                                    setEditingRule(r=>({...r!,startDate:d?.toISOString() ?? null}))
                                }
                                renderInput={p=><TextField {...p} size="small"/>}
                            />
                            <DatePicker
                                label="End Date"
                                value={editingRule?.endDate ? new Date(editingRule.endDate) : null}
                                onChange={d=>
                                    setEditingRule(r=>({...r!,endDate:d?.toISOString() ?? null}))
                                }
                                renderInput={p=><TextField {...p} size="small"/>}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog}>Cancel</Button>
                        <Button variant="contained" onClick={saveRule}>
                            {editingRule?.id ? "Save" : "Create"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* DELETE CONFIRMATION DIALOG */}
                <Dialog open={confirmOpen} onClose={closeConfirm}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete this rule?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeConfirm}>Cancel</Button>
                        <Button color="error" variant="contained" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </LocalizationProvider>
    );
}
