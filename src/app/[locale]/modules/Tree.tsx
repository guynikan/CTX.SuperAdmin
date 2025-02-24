import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ReactFlow, addEdge, Controls, Handle, Position, useNodesState, useEdgesState, ReactFlowProvider } from "@xyflow/react";
import dagre from "dagre";
import "@xyflow/react/dist/style.css";
import { Box, Button, CircularProgress, Modal, TextField, Typography } from "@mui/material";
import CustomNode from "./CustomNode";

const nodeWidth = 200;
const nodeHeight = 100;

const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB" });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
};

const TreeFlowComponent = ({ data }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newNodeData, setNewNodeData] = useState({ name: "", parentId: "" });
  const [loading, setLoading] = useState(false);

  const handleOpenModal = (parentId) => {
    setNewNodeData({ name: "", parentId });
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const processTreeData = useCallback(() => {
    if (!data || data.length === 0) return;

    const nodesMap = new Map();
    const edgesList = [];

    const traverseTree = (node, parentId = null) => {
      if (!node || nodesMap.has(node.id)) return;

      nodesMap.set(node.id, {
        id: node.id,
        data: { label: node.name },
        position: { x: 0, y: 0 },
        type: "custom",
        draggable: false, 

      });

      if (parentId) {
        edgesList.push({ id: `${parentId}-${node.id}`, source: parentId, target: node.id });
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => traverseTree(child, node.id));
      }
    };

    data.filter(n => n.level === 0).forEach(rootNode => traverseTree(rootNode));

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(Array.from(nodesMap.values()), edgesList);

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [data]);

  
  const removeNode = async (nodeId: string) => {
    setLoading(true);
    try {
      // UseModulesHook para remover
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  useEffect(() => {
    processTreeData();
  }, [processTreeData]);


  return (
    <div style={{ width: "100%", height: "600px", position: "relative" }}>
      {loading && <CircularProgress style={{ position: "absolute", top: "50%", left: "50%", zIndex: 10 }} />}
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onConnect={onConnect}
        nodeTypes={nodeTypes} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange} 
        fitView>
        <Controls />
      </ReactFlow>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 300, bgcolor: "background.paper", borderRadius: 2, boxShadow: 24, p: 3 }}>
          <Typography variant="h6">Adicionar Novo Módulo</Typography>
          <TextField label="Nome" fullWidth margin="dense" value={newNodeData.name} onChange={(e) => setNewNodeData({ ...newNodeData, name: e.target.value })} />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleCloseModal} color="secondary" sx={{ mr: 1 }}>Cancelar</Button>
            {/* <Button onClick={handleAddNode} variant="contained" color="primary" disabled={loading}>Adicionar</Button> */}
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default function TreeFlow({data}) {
  return (
    <ReactFlowProvider>
      <TreeFlowComponent data={data} />
    </ReactFlowProvider>
  );
}
