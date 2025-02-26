import { useCallback } from "react";
import { Node, Edge } from "@xyflow/react";
import { getLayoutedElements } from "../functions/getLayoutedElements";
import { SetState } from "@/types/modules";

type TreeNode = {
  id: string;
  name: string;
  level: number;
  children?: TreeNode[];
}

export function useProcessTreeData(setNodes: SetState<Node[]>, setEdges: SetState<Edge[]>) {
  return useCallback((data: TreeNode[]) => {
    if (!data || data.length === 0) return;

    const nodesMap = new Map<string, Node>();
    const edgesList: Edge[] = [];

    const traverseTree = (node: TreeNode, parentId: string | null = null) => {
      if (!node || nodesMap.has(node.id)) return;

      nodesMap.set(node.id, {
        id: node.id,
        data: { id: node.id, label: node.name, parentId},
        position: { x: 0, y: 0 },
        type: "custom",
        draggable: false,
      });

      if (parentId) {
        edgesList.push({ id: `${parentId}-${node.id}`, source: parentId, target: node.id });
      }

      node.children?.forEach((child) => traverseTree(child, node.id));
    };

    data.filter(n => n.level === 0).forEach(rootNode => traverseTree(rootNode));

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      Array.from(nodesMap.values()),
      edgesList
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [setNodes, setEdges]);
}
