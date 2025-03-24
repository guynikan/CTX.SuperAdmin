import { useState, useCallback } from "react";

export function useNodeModal() {
  const [openModal, setOpenModal] = useState(false);
  const [newNodeData, setNewNodeData] = useState({ name: "", description:"", parentId: "" });

  const handleAddModal = useCallback((parentId: string) => {
    setNewNodeData({ name: "", description:"", parentId });
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
