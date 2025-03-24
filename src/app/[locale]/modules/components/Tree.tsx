"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ReactFlow, addEdge, Controls, useNodesState, useEdgesState, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

import CustomNode from "./CustomNode";
import DeleteModal from "./DeleteModal";


import { useCreateModule, useDeleteModule } from "@/hooks/useModules";
import { useNodeModal } from "../hooks/useNodeModal";
import { useProcessTreeData } from "../hooks/useProcessTreeData";
import CreateModuleModal from "./CreateModal";


const TreeFlowComponent = ({ data }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [loading, setLoading] = useState(false);
  const { openModal, setOpenModal, handleAddModal, handleCloseModal, newNodeData, setNewNodeData } = useNodeModal();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [hasChildren, setHasChildren] = useState(false);

  const processTreeData = useProcessTreeData(setNodes, setEdges);

  const treeData = useMemo(() => {
    const convertToTree = (items) => {
      const map = new Map();
      const tree = [];

      items.forEach((item) => {
        map.set(item.id, { ...item, children: [] });
      });

      items.forEach((item) => {
        if (item.parentId) {
          map.get(item.parentId)?.children.push(map.get(item.id));
        } else {
          tree.push(map.get(item.id));
        }
      });

      return tree;
    };

    return convertToTree(data || []);
  }, [data]);

  const createModuleMutation = useCreateModule();

  const handleDeleteModal = useCallback( (module: string) => {

    const moduleHasChildren = edges.some((edge) => edge.source === module);
    setSelectedModule(module);
    setHasChildren(moduleHasChildren);
    setOpenConfirm(true);
  },[edges]);

  const addNode = async (moduleData: object) => {
    if (!moduleData.name.trim()) {
      toast.error("O nome do módulo é obrigatório.");
      return;
    }
    setLoading(true);
    try {
      await createModuleMutation.mutateAsync({
        name: moduleData.name,
        description: moduleData.description,
        parentId: newNodeData.parentId,
      });
      setOpenModal(false);
    } catch (error) {
      console.error("Erro ao adicionar Módulo:", error);
    } finally {
      setLoading(false);
    }
  };

  const { mutateAsync: deleteModule } = useDeleteModule();

  const deleteNode = useCallback(async () => {
      if (!selectedModule) {
        toast.error("Módulo não encontrado.");
        return;
      }
      try {
        await deleteModule(selectedModule);
        setNodes((nds) => nds.filter((node) => node.id !== selectedModule));
        setEdges((eds) => eds.filter((edge) => edge.source !== selectedModule && edge.target !== selectedModule));
      } catch (error) {
        console.error(error);
      } finally{
        setOpenConfirm(false)
      }
    },
    [setNodes, selectedModule, setEdges, deleteModule]
  );
  
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  
  const nodeTypes = useMemo(
    () => ({
      custom: (nodeProps) => (
        <CustomNode
          {...nodeProps}
          handleModal={handleAddModal}
          deleteNode={handleDeleteModal}
        />
      ),
    }),
    [handleAddModal, handleDeleteModal]
  );

  useEffect(() => {
    processTreeData(treeData);
  }, [treeData, processTreeData]);

  return (
    <div style={{ width: "100%", height: "90vh", position: "relative" }}>
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

      <CreateModuleModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={addNode}
        moduleData={newNodeData}
        setModuleData={(module: object) => setNewNodeData(module)}
        loading={loading}
      />

      <DeleteModal
        confirmDelete={deleteNode}
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        module={selectedModule}
        hasChildren={hasChildren}
      />;
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
