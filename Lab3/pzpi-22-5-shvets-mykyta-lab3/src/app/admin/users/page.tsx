// src/app/admin/users/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Typography,
    Button,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    TableSortLabel,
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Download as DownloadIcon,
} from "@mui/icons-material";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { User } from "@/context/AuthContext";

type Order = "asc" | "desc";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [filterText, setFilterText] = useState("");
    const [orderBy, setOrderBy] = useState<keyof User>("id");
    const [order, setOrder] = useState<Order>("asc");
    const router = useRouter();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const resp = await api.get<User[]>("/user/all");
            setUsers(resp.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (id: number) => router.push(`/admin/users/edit/${id}`);
    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };
    const handleConfirmDelete = async () => {
        if (!selectedUser) return;
        try {
            await api.delete(`/user/${selectedUser.id}`);
            fetchUsers();
        } catch (err) {
            console.error(err);
        } finally {
            setDialogOpen(false);
            setSelectedUser(null);
        }
    };
    const handleCancelDelete = () => {
        setDialogOpen(false);
        setSelectedUser(null);
    };

    // filter + sort
    const filteredAndSorted = useMemo(() => {
        const lower = filterText.toLowerCase();
        const filtered = users.filter(u =>
            [u.id.toString(), u.firstName, u.lastName, u.email, u.role]
                .some(field => field.toLowerCase().includes(lower))
        );
        return filtered.sort((a, b) => {
            const aVal = a[orderBy], bVal = b[orderBy];
            let cmp = 0;
            if (typeof aVal === "number" && typeof bVal === "number") {
                cmp = aVal - bVal;
            } else {
                cmp = String(aVal).localeCompare(String(bVal));
            }
            return order === "asc" ? cmp : -cmp;
        });
    }, [users, filterText, orderBy, order]);

    const handleRequestSort = (property: keyof User) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    // export CSV
    const exportCsv = () => {
        const header = ["ID","First Name","Last Name","Email","Role"];
        const rows = filteredAndSorted.map(u => [
            u.id,
            u.firstName,
            u.lastName,
            u.email,
            u.role
        ]);
        const csv = [
            header.join(","),
            ...rows.map(r => r.map(String).map(v => `"${v.replace(/"/g,'""')}"`).join(","))
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "users_export.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5">Users</Typography>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        sx={{ mr: 1 }}
                        onClick={exportCsv}
                    >
                        Export CSV
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => router.push("/admin/users/create")}
                    >
                        Create User
                    </Button>
                </Box>
            </Box>

            {/* Filter */}
            <Box sx={{ mb: 2, maxWidth: 300 }}>
                <TextField
                    label="Search users…"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                />
            </Box>

            {/* Table */}
            <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ maxHeight: "60vh" }}
            >
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "background.paper" }}>
                            {[
                                { id: "id", label: "ID" },
                                { id: "firstName", label: "First Name" },
                                { id: "lastName", label: "Last Name" },
                                { id: "email", label: "Email" },
                                { id: "role", label: "Role" },
                            ].map(col => (
                                <TableCell key={col.id}>
                                    <TableSortLabel
                                        active={orderBy === col.id}
                                        direction={orderBy === col.id ? order : "asc"}
                                        onClick={() => handleRequestSort(col.id as keyof User)}
                                    >
                                        {col.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Loading…
                                </TableCell>
                            </TableRow>
                        ) : filteredAndSorted.length > 0 ? (
                            filteredAndSorted.map((u, idx) => (
                                <TableRow
                                    key={u.id}
                                    hover
                                    sx={{
                                        backgroundColor: idx % 2 === 0 ? "background.default" : "action.hover",
                                    }}
                                >
                                    <TableCell>{u.id}</TableCell>
                                    <TableCell>{u.firstName}</TableCell>
                                    <TableCell>{u.lastName}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>{u.role}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={() => handleEdit(u.id)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(u)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation */}
            <Dialog open={dialogOpen} onClose={handleCancelDelete}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete{" "}
                        <strong>
                            {selectedUser?.firstName} {selectedUser?.lastName}
                        </strong>
                        ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
