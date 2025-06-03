"use client";

import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import api from "@/services/api";
import { useRouter } from "next/navigation";

interface AccessPoint {
    id: number;
    type: string;
    identifier: string;
    roomId: number;
    createdAt: string;
    updatedAt: string | null;
}

export default function AccessPointsPage() {
    const [points, setPoints] = useState<AccessPoint[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selectedPoint, setSelectedPoint] = useState<AccessPoint | null>(null);
    const router = useRouter();

    const fetchPoints = async () => {
        try {
            setLoading(true);
            const resp = await api.get<AccessPoint[]>("/accesspoint");
            setPoints(resp.data);
        } catch (err) {
            console.error("Failed to fetch access points:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPoints();
    }, []);

    const handleEdit = (id: number) => {
        router.push(`/admin/access-points/edit/${id}`);
    };

    const handleDeleteClick = (point: AccessPoint) => {
        setSelectedPoint(point);
        setDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedPoint) return;
        try {
            await api.delete(`/accesspoint/${selectedPoint.id}`);
            fetchPoints();
        } catch (err) {
            console.error("Delete failed:", err);
        } finally {
            setDialogOpen(false);
            setSelectedPoint(null);
        }
    };

    const handleCancelDelete = () => {
        setDialogOpen(false);
        setSelectedPoint(null);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5">Access Points</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push("/admin/access-points/create")}
                >
                    Create Access Point
                </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Identifier</TableCell>
                            <TableCell>Room</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Updated</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : (
                            points.map((p) => (
                                <TableRow key={p.id} hover>
                                    <TableCell>{p.id}</TableCell>
                                    <TableCell>{p.type}</TableCell>
                                    <TableCell>{p.identifier}</TableCell>
                                    <TableCell>{p.roomId}</TableCell>
                                    <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>{p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-"}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={() => handleEdit(p.id)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(p)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog open={dialogOpen} onClose={handleCancelDelete} aria-labelledby="dp-title">
                <DialogTitle id="dp-title">Delete Access Point</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {`Are you sure you want to delete access point "${selectedPoint?.identifier}"?`}
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
