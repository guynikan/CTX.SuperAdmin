import { useState, useCallback } from "react";

export function useNodeModal() {
  const [openModal, setOpenModal] = useState(false);
  const [newNodeData, setNewNodeData] = useState({ name: "", parentId: "" });

  const handleAddModal = useCallback((parentId: string) => {
    setNewNodeData({ name: "", parentId });
    setOpenModal(true);
  }, []);

  const handleCloseModal = () => setOpenModal(false);

  return {
    openModal,
    handleAddModal,
    handleCloseModal,
    newNodeData,
    setOpenModal,
    setNewNodeData,
  };
}
