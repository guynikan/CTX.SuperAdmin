import { useState, useCallback } from "react";

export function useNodeModal() {
  const [openModal, setOpenModal] = useState(false);
  const [newNodeData, setNewNodeData] = useState({ name: "", parentId: "" });

  const handleOpenModal = useCallback((parentId: string) => {
    setNewNodeData({ name: "", parentId });
    setOpenModal(true);
  }, []);

  const handleCloseModal = () => setOpenModal(false);

  return {
    openModal,
    handleOpenModal,
    handleCloseModal,
    newNodeData,
    setNewNodeData,
  };
}
