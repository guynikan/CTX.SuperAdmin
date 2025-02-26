import dagre from "dagre";
import { Node, Edge } from "@xyflow/react";

const nodeWidth = 200;
const nodeHeight = 100;

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
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

  return {
    nodes: nodes.map((node) => ({
      ...node,
      position: {
        x: (dagreGraph.node(node.id)?.x || 0) - nodeWidth / 2,
        y: (dagreGraph.node(node.id)?.y || 0) - nodeHeight / 2,
      },
    })),
    edges,
  };
};
