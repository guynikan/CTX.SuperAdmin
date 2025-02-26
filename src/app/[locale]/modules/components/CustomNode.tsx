import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Handle, Position } from "@xyflow/react";

interface CustomNodeProps {
  data: { label: string, parentId: string };
  id: string;
  handleOpenModal: (parentId: string) => void;
  removeNode: (nodeId: string) => Promise<void>;
}

export default function CustomNode({ data, id, handleOpenModal, removeNode }: CustomNodeProps) {
  return (
    <Box
      sx={{
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: 1,
        textAlign: "center",
        width: 200,
        position: "relative",
        transition: "background 0.2s",
        "&:hover": {
          "& .node-buttons": { opacity: 1, transform: "translateX(-70%) scale(1)" },
        },
      }}
    >
      <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>{data.label}</Typography>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <Box
        className="node-buttons"
        sx={{
          position: "absolute",
          bottom: -7,
          left: "90%",
          transform: "translateX(-60%)",
          display: "flex",
          gap: 1,
          opacity: 0,
          transition: "opacity 0.2s ease-in-out, transform 0.2s ease-in-out",
        }}
      >
        <Button
          onClick={() => handleOpenModal(data.parentId)}
          variant="text"
          color="primary"
          size="small"
          sx={{ fontSize: 8, minWidth: 0, background: "#168cdc", padding: "1px 3px", color: "#fff" }}
        >
          add
        </Button>
        {data.parentId && (
          <Button
            onClick={() => removeNode(id)}
            variant="text"
            color="error"
            size="small"
            sx={{ fontSize: 8, minWidth: 0, padding: "1px 3px", background: "#ff4e75", color: "#fff" }}
          >
            remove
          </Button>
          )}
      </Box>
    </Box>
  );
};

