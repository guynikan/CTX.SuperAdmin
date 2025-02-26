import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ReactFlow, addEdge, Controls, useNodesState, useEdgesState, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

import CustomNode from "./CustomNode";
import AddModuleModal from "./AddModuleModal";

import { useCreateModule } from "@/hooks/useModules";
import { useNodeModal } from "../hooks/useNodeModal";
import { useProcessTreeData } from "../hooks/useProcessTreeData";


const TreeFlowComponent = ({ data }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [loading, setLoading] = useState(false);
  const { openModal, setOpenModal, handleOpenModal, handleCloseModal, newNodeData, setNewNodeData } = useNodeModal();
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const processTreeData = useProcessTreeData(setNodes, setEdges);

  const createModuleMutation = useCreateModule();

  const handleAddNode = async () => {
    if (!newNodeData.name.trim()) {
      toast.error("O nome do módulo é obrigatório.");
      return;
    }
    console.log({newNodeData})

    setLoading(true);
    try {
      await createModuleMutation.mutateAsync({
        name: newNodeData.name,
        description: "",
        parentId: newNodeData.parentId,
      });
      setOpenModal(false);
    } catch (error) {
      console.error("Erro ao adicionar Módulo:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeNode = useCallback(async (nodeId: string) => {
    setLoading(true);
    try {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [setNodes, setEdges]);

  
  const nodeTypes = useMemo(
    () => ({
      custom: (nodeProps) => (
        <CustomNode
          {...nodeProps}
          handleOpenModal={handleOpenModal}
          removeNode={removeNode}
        />
      ),
    }),
    [handleOpenModal, removeNode]
  );

  useEffect(() => {
    processTreeData(data);
  }, [data, processTreeData]);

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
      <AddModuleModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleAddNode}
        value={newNodeData.name}
        setValue={(name) => setNewNodeData((prev) => ({ ...prev, name }))}
        loading={loading}
      />
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
