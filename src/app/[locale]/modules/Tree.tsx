"use client";

import React, { useEffect, useCallback, useState } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  addEdge,
  Handle,
  Position,
} from "@xyflow/react";
import dagre from "dagre";
import "@xyflow/react/dist/style.css";
import { Modal, Box, Button, TextField, Typography } from "@mui/material";

const nodeWidth = 220;
const nodeHeight = 100;
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges) => {
  dagreGraph.setGraph({ rankdir: "TB" });
  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight }));
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));
  dagre.layout(dagreGraph);
  return nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id);
    return { ...node, position: { x, y } };
  });
};

const initialNodes = [
  { id: "1", data: { label: "Root Module" }, type: "custom", position: { x: 0, y: 0 } },
];

const initialEdges = [];

function TreeFlowComponent() {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [openModal, setOpenModal] = useState(false);
  const [newNodeData, setNewNodeData] = useState({ name: "", parentId: "" });

  useEffect(() => {
    const layoutedNodes = getLayoutedElements(nodes, edges);
    setNodes(layoutedNodes);
    setTimeout(() => fitView(), 100);
  }, [nodes.length, edges.length]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleOpenModal = (parentId) => {
    setNewNodeData((prev) => ({ ...prev, parentId }));
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleAddNode = () => {
    if (!newNodeData.name.trim() || !newNodeData.parentId) return;
    const newNodeId = `${nodes.length + 1}`;
    const newNode = {
      id: newNodeId,
      data: { label: newNodeData.name },
      position: { x: 0, y: 0 },
      type: "custom",
    };
    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, { id: `e${newNodeData.parentId}-${newNodeId}`, source: newNodeData.parentId, target: newNodeId }]);
    setNewNodeData({ name: "", parentId: "" });
    handleCloseModal();
  };

  const removeNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  const CustomNode = ({ data, id }) => (
    <div style={{
      padding: 12,
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: 10,
      boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
      textAlign: "center",
      width: nodeWidth,
    }}>
      <div style={{ fontWeight: "bold", fontSize: 12 }}>{data.label}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Button onClick={() => handleOpenModal(id)} variant="contained" color="primary" size="small" sx={{ fontSize:9, mt: 1, mr: 1 }}>
        Add
      </Button>
      <Button onClick={() => removeNode(id)}  variant="contained" color="error" size="small" sx={{ fontSize:9, mt: 1, mr: 1 }}>
        Remove
      </Button>
    </div>
  );

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={{ custom: CustomNode }} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView>
        <Controls />
        <Background />
      </ReactFlow>
      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="modal-title">
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 300, bgcolor: "background.paper", borderRadius: 2, boxShadow: 24, p: 3 }}>
          <Typography id="modal-title" variant="h6" gutterBottom>
            Adicionar Novo Módulo
          </Typography>
          <TextField
            label="Nome"
            fullWidth
            margin="dense"
            value={newNodeData.name}
            onChange={(e) => setNewNodeData({ ...newNodeData, name: e.target.value })}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleCloseModal} color="secondary" sx={{ mr: 1 }}>
              Cancelar
            </Button>
            <Button onClick={handleAddNode} variant="contained" color="primary">
              Adicionar
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default function TreeFlow() {
  return (
    <ReactFlowProvider>
      <TreeFlowComponent />
    </ReactFlowProvider>
  );
}
