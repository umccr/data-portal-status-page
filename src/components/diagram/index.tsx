import React, { useCallback, useEffect } from 'react';
import ReactFlow, { addEdge, Controls, useNodesState, useEdgesState } from 'reactflow';
import ButtonEdge from './ButtonEdge';

import { nodes as initialNodes, edges as initialEdges } from './initial-elements';
import CustomNode from './CustomNode';
import WorkflowNode from './WorkflowNode';
import { CustomArrowHeader } from './CustomArrowHeader';

import 'reactflow/dist/style.css';
import './index.css';

const nodeTypes = {
  custom: CustomNode,
  workflow: WorkflowNode,
};
const edgeTypes = {
  buttonedge: ButtonEdge,
};

// const onInit = (reactFlowInstance: any) => console.log('flow loaded:', reactFlowInstance);

const OverviewFlow = ({ initialNodes, initialEdges }: any) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // we are using a bit of a shortcut here to adjust the edge type
  // this could also be done with a custom edge for example
  // const edgesWithUpdatedTypes = edges.map((edge) => {
  //   if (edge.sourceHandle) {
  //     const customNode = nodes.find((node) => node.type === 'custom');
  //   const edgeType = customNode ? customNode.data.selects[edge.sourceHandle] : undefined;
  //     edge.type = edgeType;
  //   }

  //   return edge;
  // });

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const proOptions = { hideAttribution: true };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      edgeTypes={edgeTypes}
      fitView
      nodeTypes={nodeTypes}
      proOptions={proOptions}>
      <Controls />
      {/* <Background color="#aaa" gap={20} /> */}
    </ReactFlow>
  );
};

const BasicFlow = () => {
  return (
    <div style={{ height: '500px', width: '1300px', overflow: 'auto' }}>
      <CustomArrowHeader />
      <OverviewFlow initialNodes={initialNodes} initialEdges={initialEdges} />
    </div>
  );
};

export default BasicFlow;
