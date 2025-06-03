"use client";

import { Box, Typography, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

type SelectedNode =
    | { type: "building"; data: any }
    | { type: "floor"; data: any }
    | { type: "room"; data: any }
    | { type: "accessPoint"; data: any };

interface Props {
    selectedNode: SelectedNode;
    onEdit: () => void;
}

export default function DetailCard({ selectedNode, onEdit }: Props) {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Details:{" "}
                {{
                    building: "Building",
                    floor: "Floor",
                    room: "Room",
                    accessPoint: "Access Point",
                }[selectedNode.type]}
            </Typography>

            <Box mt={2}>
                {selectedNode.type === "building" && (
                    <>
                        <Typography><strong>Name:</strong> {selectedNode.data.name}</Typography>
                        <Typography><strong>Description:</strong> {selectedNode.data.description}</Typography>
                        <Typography><strong>Location:</strong> {selectedNode.data.location}</Typography>
                        <Typography><strong>Floors:</strong> {selectedNode.data.floors?.length}</Typography>
                    </>
                )}

                {selectedNode.type === "floor" && (
                    <>
                        <Typography><strong>Floor Number:</strong> {selectedNode.data.number}</Typography>
                        <Typography><strong>Description:</strong> {selectedNode.data.description || "—"}</Typography>
                        <Typography><strong>Rooms:</strong> {selectedNode.data.rooms?.length}</Typography>
                    </>
                )}

                {selectedNode.type === "room" && (
                    <>
                        <Typography><strong>Room Name:</strong> {selectedNode.data.name}</Typography>
                        <Typography><strong>Type:</strong> {selectedNode.data.type || "—"}</Typography>
                        <Typography><strong>Description:</strong> {selectedNode.data.description || "—"}</Typography>
                        <Typography><strong>Capacity:</strong> {selectedNode.data.capacity ?? "—"}</Typography>
                        <Typography><strong>Access Points:</strong> {selectedNode.data.accessPoints?.length}</Typography>
                    </>
                )}

                {selectedNode.type === "accessPoint" && (
                    <>
                        <Typography><strong>Identifier:</strong> {selectedNode.data.identifier}</Typography>
                        <Typography><strong>Type:</strong> {selectedNode.data.type}</Typography>
                        <Typography><strong>Created At:</strong> {new Date(selectedNode.data.createdAt || "").toLocaleString()}</Typography>
                        <Typography><strong>Updated At:</strong> {selectedNode.data.updatedAt ? new Date(selectedNode.data.updatedAt).toLocaleString() : "—"}</Typography>
                    </>
                )}
            </Box>

            <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                sx={{ mt: 3 }}
                onClick={onEdit}
            >
                Edit
            </Button>
        </Box>
    );
}
