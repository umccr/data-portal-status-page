import React from 'react';
import { Handle, HandleProps } from 'reactflow';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export enum NodeBackground {
  default = 'white',
  ica_cloud = '#B0E3E6',
  aws_cloud = '#E3C800',
  basespace_cloud = '#D0CEE2',
  om_prem_unimelb = '#FA6800',
  unactived = 'gray',
}

type tooltipProps = {
  status: string;
  description: string;
  comments: string;
};

interface WorkflowNodeProps {
  data: {
    content: string | React.ReactNode;
    backgroundColor?: NodeBackground;
    handlers?: HandleProps[];
    tooltip?: tooltipProps;
  };
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(10),
    border: '1px solid #dadde9',
    borderRadius: 4,
  },
}));

const WrappedNodeData = React.forwardRef<HTMLDivElement, any>(function MyComponent(props, ref) {
  //  Spread the props to the underlying DOM element.
  return (
    <div {...props} ref={ref} style={{ borderRadius: '5px' }} className='WrappedNode'>
      {props.children}
    </div>
  );
});

function WorkflowNode({ data }: WorkflowNodeProps) {
  return (
    <>
      <HtmlTooltip
        placement='right'
        title={
          <React.Fragment>
            <Typography color='inherit'> {`status: ${data.tooltip?.status}`}</Typography>
            <List>
              <ListItem>
                <ListItemText primary='Description' secondary={`${data.tooltip?.description}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary='Status' secondary={`${data.tooltip?.comments}`} />
              </ListItem>
            </List>
          </React.Fragment>
        }>
        <WrappedNodeData>
          <div className='WrappedNode__content'>{data.content}</div>
        </WrappedNodeData>
      </HtmlTooltip>

      {data.handlers?.map((handler, index) => {
        return <Handle key={index} {...handler} />;
      })}
      {/* <Handle type="target" position={Position.Top} isConnectable={true}  />
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
        isConnectable={true}
      />
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={true} style={{"left": "66%"}} /> */}
    </>
  );
}

export default WorkflowNode;
