"use client";

import React, { useEffect, useState } from "react";
import api from "@/services/api";
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Drawer,
    TextField,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    MenuItem
} from "@mui/material";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface AccessPoint {
    id: number;
    identifier: string;
    type: string;
}

interface Room {
    id: number;
    name: string;
    description?: string;
    type?: string;
    capacity?: number;
    floorId: number;
    accessPoints: AccessPoint[];
}

interface Floor {
    id: number;
    number: number;
    description?: string;
    buildingId: number;
    rooms: Room[];
}

interface Building {
    id: number;
    name: string;
    description?: string;
    location?: string;
    floors: Floor[];
}

type EntityType = "building" | "floor" | "room" | "accessPoint";
type SelectedNode =
    | { type: "building"; data: Building }
    | { type: "floor"; data: Floor }
    | { type: "room"; data: Room }
    | { type: "accessPoint"; data: AccessPoint };

const roomTypes = [
    "Auditorium",
    "Laboratory",
    "Office",
    "Lounge",
    "Library",
    "Gym",
    "Cafeteria",
    "AdminArea",
    "CommonArea",
    "Parking",
    "Outdoor",
    "Other",
];

export default function CampusPage() {
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
    const [expanded, setExpanded] = useState<string[]>([]);

    const [editOpen, setEditOpen] = useState(false);
    const [editForm, setEditForm] = useState<any>({});

    const [addOpen, setAddOpen] = useState(false);
    const [toAdd, setToAdd] = useState<{ type: EntityType; parentId: number | null }>({
        type: "building",
        parentId: null,
    });
    const [addForm, setAddForm] = useState<any>({});

    const [deleteOpen, setDeleteOpen] = useState(false);

    const fetchBuildings = async () => {
        setLoading(true);
        try {
            const res = await api.get<Building[]>("building");
            setBuildings(res.data);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBuildings();
    }, []);

    const handleSelect = (nodeId: string) => {
        const [p, idStr] = nodeId.split("-");
        const id = parseInt(idStr, 10);
        for (const b of buildings) {
            if (p === "b" && b.id === id) return setSelectedNode({ type: "building", data: b });
            for (const f of b.floors) {
                if (p === "f" && f.id === id) return setSelectedNode({ type: "floor", data: f });
                for (const r of f.rooms) {
                    if (p === "r" && r.id === id) return setSelectedNode({ type: "room", data: r });
                    for (const ap of r.accessPoints) {
                        if (p === "ap" && ap.id === id)
                            return setSelectedNode({ type: "accessPoint", data: ap });
                    }
                }
            }
        }
        setSelectedNode(null);
    };

    const openEditDrawer = () => {
        if (!selectedNode || selectedNode.type === "accessPoint") return;
        setEditForm({ ...selectedNode.data });
        setEditOpen(true);
    };
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleEditSave = async () => {
        if (!selectedNode) return;

        const { type, data } = selectedNode;
        let endpoint: string;
        let payload: any;

        switch (type) {
            case "building":
                endpoint = "building";
                payload = {
                    name:        editForm.name,
                    description: editForm.description,
                    location:    editForm.location,
                };
                break;

            case "floor":
                endpoint = "floor";
                payload = {
                    buildingId:  (data as Floor).buildingId,
                    number:      Number(editForm.number),
                    description: editForm.description,
                };
                break;

            case "room":
                endpoint = "room";
                payload = {
                    floorId:     (data as Room).floorId,
                    name:        editForm.name,
                    description: editForm.description,
                    type:        editForm.type,
                    capacity:    Number(editForm.capacity),
                };
                break;

            default:
                return;
        }

        try {
            await api.put(`${endpoint}/${data.id}`, payload);
            setEditOpen(false);

            setBuildings(bs =>
                bs.map(b => {
                    if (type === "building" && b.id === data.id) {
                        return { ...b, ...payload };
                    }
                    return {
                        ...b,
                        floors: b.floors.map(f => {
                            if (type === "floor" && f.id === data.id) {
                                return {
                                    ...f,
                                    number:      payload.number,
                                    description: payload.description,
                                    rooms:       f.rooms
                                };
                            }
                            return {
                                ...f,
                                rooms: f.rooms.map(r => {
                                    if (type === "room" && r.id === data.id) {
                                        return {
                                            ...r,
                                            name:        payload.name,
                                            description: payload.description,
                                            type:        payload.type,
                                            capacity:    payload.capacity,
                                            accessPoints:r.accessPoints
                                        };
                                    }
                                    return r;
                                })
                            };
                        })
                    };
                })
            );

            setSelectedNode(prev =>
                prev && prev.type === type
                    ? {
                        type,
                        data: {
                            ...prev.data,
                            ...payload
                        }
                    }
                    : prev
            );
        } catch (err: any) {
            console.error(err);
            alert("❌ Failed to save changes: " + (err.response?.data || err.message));
        }
    };

    const openAddDialog = (type: EntityType, parentId: number | null) => {
        setToAdd({ type, parentId });
        switch (type) {
            case "building":
                setAddForm({ name: "", description: "", location: "" });
                break;
            case "floor":
                setAddForm({ number: "", description: "" });
                break;
            case "room":
                setAddForm({ name: "", description: "", type: roomTypes[0], capacity: 0 });
                break;
            case "accessPoint":
                setAddForm({ identifier: "", type: "" });
                break;
        }
        setAddOpen(true);
    };
    const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setAddForm(f => ({ ...f, [e.target.name]: e.target.value }));
    const handleAddSave = async () => {
        const { type, parentId } = toAdd;
        try {
            switch (type) {
                case "building":
                    await api.post("building", addForm);
                    break;
                case "floor":
                    await api.post("floor", {
                        buildingId: parentId,
                        number: Number(addForm.number),
                        description: addForm.description,
                    });
                    break;
                case "room":
                    await api.post("room", {
                        floorId: parentId,
                        name: addForm.name,
                        description: addForm.description,
                        type: addForm.type,
                        capacity: Number(addForm.capacity),
                    });
                    break;
                case "accessPoint":
                    await api.post("accesspoint", {
                        roomId: parentId,
                        identifier: addForm.identifier,
                        type: addForm.type,
                    });
                    break;
            }
            setAddOpen(false);
            fetchBuildings();
        } catch {
            alert("Failed to add");
        }
    };

    const openDeleteConfirm = () => {
        if (selectedNode) setDeleteOpen(true);
    };
    const handleDelete = async () => {
        if (!selectedNode) return;
        const base = {
            building: "building",
            floor: "floor",
            room: "room",
            accessPoint: "accesspoint",
        }[selectedNode.type];
        await api.delete(`${base}/${selectedNode.data.id}`);
        setDeleteOpen(false);
        setBuildings(bs =>
            bs
                .map(b => {
                    if (type === "building") return null;
                    return {
                        ...b,
                        floors:
                            type === "floor"
                                ? b.floors.filter(f => f.id !== data.id)
                                : b.floors.map(f =>
                                    type === "room"
                                        ? { ...f, rooms: f.rooms.filter(r => r.id !== data.id) }
                                        : {
                                            ...f,
                                            rooms: f.rooms.map(r =>
                                                type === "accessPoint"
                                                    ? { ...r, accessPoints: r.accessPoints.filter(ap => ap.id !== data.id) }
                                                    : r
                                            )
                                        }
                                )
                    };
                })
                .filter(Boolean) as Building[]
        );

        setSelectedNode(null);
    };

    if (loading) {
        return (
            <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box display="flex" height="100%">
            { }
            <Paper sx={{ width: 300, m: 2, p: 2, display: "flex", flexDirection: "column" }} elevation={3}>
                <Typography variant="h6" gutterBottom>
                    Campus Structure
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<AddBusinessIcon />}
                    sx={{ mb: 2 }}
                    onClick={() => openAddDialog("building", null)}
                >
                    Add Building
                </Button>
                <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                    <TreeView
                        expanded={expanded}
                        onNodeToggle={(_, nodes) => setExpanded(nodes)}
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                        onNodeSelect={(_, id) => handleSelect(id!)}
                        sx={{
                            "& .MuiTreeItem-content": {
                                py: 0.5,
                                px: 1,
                                borderRadius: 1,
                                "&:hover": { backgroundColor: "rgba(25,118,210,0.08)" },
                                "&.Mui-selected": { backgroundColor: "rgba(25,118,210,0.15) !important" },
                            },
                            "& .MuiTreeItem-label": { fontSize: 14 },
                            "& .MuiTreeItem-group": {
                                ml: 2,
                                pl: 1,
                                borderLeft: "1px dashed rgba(0,0,0,0.1)",
                            },
                        }}
                    >
                        {buildings.map(b => (
                            <TreeItem
                                key={`b-${b.id}`}
                                nodeId={`b-${b.id}`}
                                label={
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Typography>🏢 {b.name}</Typography>
                                        <IconButton size="small" onClick={e => { e.stopPropagation(); openAddDialog("floor", b.id); }}>
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                }
                            >
                                {(b.floors || []).map(f => (
                                    <TreeItem
                                        key={`f-${f.id}`}
                                        nodeId={`f-${f.id}`}
                                        label={
                                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                                <Typography>🧱 Floor {f.number}</Typography>
                                                <IconButton size="small" onClick={e => { e.stopPropagation(); openAddDialog("room", f.id); }}>
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        }
                                    >
                                        {(f.rooms || []).map(r => (
                                            <TreeItem
                                                key={`r-${r.id}`}
                                                nodeId={`r-${r.id}`}
                                                label={
                                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                                        <Typography>🚪 {r.name}</Typography>
                                                        <IconButton size="small" onClick={e => { e.stopPropagation(); openAddDialog("accessPoint", r.id); }}>
                                                            <AddIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                }
                                            >
                                                {(r.accessPoints || []).map(ap => (
                                                    <TreeItem
                                                        key={`ap-${ap.id}`}
                                                        nodeId={`ap-${ap.id}`}
                                                        label={`🔐 ${ap.identifier} (${ap.type})`}
                                                    />
                                                ))}
                                            </TreeItem>
                                        ))}
                                    </TreeItem>
                                ))}
                            </TreeItem>
                        ))}
                    </TreeView>
                </Box>
            </Paper>

            { }
            <Box flexGrow={1} p={4}>
                {selectedNode ? (
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Details: {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
                        </Typography>

                        {selectedNode.type === "building" && (
                            <>
                                <Typography><strong>Name:</strong> {selectedNode.data.name}</Typography>
                                <Typography><strong>Location:</strong> {selectedNode.data.location}</Typography>
                            </>
                        )}

                        {selectedNode.type === "floor" && (
                            <>
                                <Typography><strong>Floor #:</strong> {selectedNode.data.number}</Typography>
                            </>
                        )}

                        {selectedNode.type === "room" && (
                            <>
                                <Typography><strong>Name:</strong> {selectedNode.data.name}</Typography>
                                <Typography><strong>Type:</strong> {selectedNode.data.type}</Typography>
                                <Typography><strong>Capacity:</strong> {selectedNode.data.capacity}</Typography>
                            </>
                        )}

                        {selectedNode.type === "accessPoint" && (
                            <Typography><strong>Identifier:</strong> {selectedNode.data.identifier}</Typography>
                        )}

                        {"description" in selectedNode.data && (
                            <Typography mt={2}>
                                <strong>Description:</strong> {selectedNode.data.description || "—"}
                            </Typography>
                        )}

                        <Box mt={3} display="flex" gap={2}>
                            {selectedNode.type !== "accessPoint" && (
                                <Button variant="contained" startIcon={<EditIcon />} onClick={openEditDrawer}>
                                    Edit
                                </Button>
                            )}
                            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={openDeleteConfirm}>
                                Delete
                            </Button>
                        </Box>
                    </Paper>
                ) : (
                    <Typography variant="h5" color="textSecondary">
                        Select an item to view, edit, or delete.
                    </Typography>
                )}
            </Box>

            { }
            {selectedNode && selectedNode.type !== "accessPoint" && (
                <Drawer anchor="right" open={editOpen} onClose={() => setEditOpen(false)}>
                    <Box p={3} width={350}>
                        <Typography variant="h6" gutterBottom>
                            Edit {selectedNode.type}
                        </Typography>
                        <Stack spacing={2} mt={2}>
                            {selectedNode.type === "building" && (
                                <>
                                    <TextField label="Name" name="name" fullWidth value={editForm.name} onChange={handleEditChange}/>
                                    <TextField label="Description" name="description" fullWidth multiline rows={3} value={editForm.description} onChange={handleEditChange}/>
                                    <TextField label="Location" name="location" fullWidth value={editForm.location} onChange={handleEditChange}/>
                                </>
                            )}
                            {selectedNode.type === "floor" && (
                                <>
                                    <TextField label="Floor Number" name="number" type="number" fullWidth value={editForm.number} onChange={handleEditChange}/>
                                    <TextField label="Description" name="description" fullWidth multiline rows={3} value={editForm.description} onChange={handleEditChange}/>
                                </>
                            )}
                            {selectedNode.type === "room" && (
                                <>
                                    <TextField label="Name" name="name" fullWidth value={editForm.name} onChange={handleEditChange}/>
                                    <TextField label="Description" name="description" fullWidth multiline rows={3} value={editForm.description} onChange={handleEditChange}/>
                                    <TextField
                                        select
                                        label="Type"
                                        name="type"
                                        fullWidth
                                        value={editForm.type}
                                        onChange={handleEditChange}
                                    >
                                        {roomTypes.map(rt => (
                                            <MenuItem key={rt} value={rt}>{rt}</MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        label="Capacity"
                                        name="capacity"
                                        type="number"
                                        fullWidth
                                        value={editForm.capacity}
                                        onChange={handleEditChange}
                                    />
                                </>
                            )}
                            <Button variant="contained" onClick={handleEditSave}>Save Changes</Button>
                        </Stack>
                    </Box>
                </Drawer>
            )}

            { }
            <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
                <DialogTitle>Add {toAdd.type.charAt(0).toUpperCase() + toAdd.type.slice(1)}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1} width={360}>
                        {toAdd.type === "building" && (
                            <>
                                <TextField label="Name" name="name" fullWidth value={addForm.name} onChange={handleAddChange}/>
                                <TextField label="Description" name="description" fullWidth value={addForm.description} onChange={handleAddChange}/>
                                <TextField label="Location" name="location" fullWidth value={addForm.location} onChange={handleAddChange}/>
                            </>
                        )}
                        {toAdd.type === "floor" && (
                            <>
                                <TextField label="Floor Number" name="number" type="number" fullWidth value={addForm.number} onChange={handleAddChange}/>
                                <TextField label="Description" name="description" fullWidth value={addForm.description} onChange={handleAddChange}/>
                            </>
                        )}
                        {toAdd.type === "room" && (
                            <>
                                <TextField label="Name" name="name" fullWidth value={addForm.name} onChange={handleAddChange}/>
                                <TextField label="Description" name="description" fullWidth value={addForm.description} onChange={handleAddChange}/>
                                <TextField
                                    select
                                    label="Type"
                                    name="type"
                                    fullWidth
                                    value={addForm.type}
                                    onChange={handleAddChange}
                                >
                                    {roomTypes.map(rt => (
                                        <MenuItem key={rt} value={rt}>{rt}</MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    label="Capacity"
                                    name="capacity"
                                    type="number"
                                    fullWidth
                                    value={addForm.capacity}
                                    onChange={handleAddChange}
                                />
                            </>
                        )}
                        {toAdd.type === "accessPoint" && (
                            <>
                                <TextField label="Identifier" name="identifier" fullWidth value={addForm.identifier} onChange={handleAddChange}/>
                                <TextField label="Type" name="type" fullWidth value={addForm.type} onChange={handleAddChange}/>
                            </>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleAddSave}>Save</Button>
                </DialogActions>
            </Dialog>

            { }
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this <strong>{selectedNode?.type}</strong>? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
