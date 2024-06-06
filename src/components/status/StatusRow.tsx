import { useState, useEffect } from 'react';

import { groupBy, sortBy } from 'lodash';

// Aws amplify components
import { AmplifyApiCall } from '../../utils/AmplifyApiCall';

// mui components
import styled from '@mui/material/styles/styled';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Custom Component
import { WorkflowTypeEquivalence, createQueryParameterFromArray } from '../../utils/Constants';
import StatusChip from './StatusChip';
import { useDialogContext } from '../../utils/DialogComponent';

// Remove `prod` from Domain Name
const domain_name = (import.meta.env.VITE_UMCCR_DOMAIN_NAME || '').replace('prod.', '');
// use the new portal at portal.xxx.umccr.org replace old "data.xxx.umccr.org"
const DATA_PORTAL_CLIENT_DOMAIN = 'portal.' + domain_name;

const StyledTableRow = styled(TableRow)(() => ({
  backgroundColor: 'white',
  height: '3rem',
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 1,
  },
}));

function groupWorkflow(metadataCompletedWorkflow: any[], workflow_list: string[]) {
  const groupedWorkflowStatus: { [key: string]: string } = {};

  for (const workflow_display of workflow_list) {
    let workflowStatusResult = '-'; // '-' by default

    // Group all workflows result to a dict
    const groupWorkflowType = groupBy(metadataCompletedWorkflow, (workflowObject: any) => {
      return workflowObject['type_name'];
    });

    for (const key in groupWorkflowType) {
      // Find matching workflow for the display
      if (key === workflow_display || key === WorkflowTypeEquivalence[workflow_display]) {
        // Sort in case of multiple workflow runs to pick
        // the latest end (timestsamp)
        const workflowData = sortBy(groupWorkflowType[key], (o: any) => o.end).reverse();

        // Since the sort is reverse
        // The latest one must be the first index
        workflowStatusResult = workflowData[0]['end_status'];
      }
    }

    groupedWorkflowStatus[workflow_display] = workflowStatusResult;
  }

  return groupedWorkflowStatus;
}

function StatusRow(props: any) {
  const { metadata, workflow_list, columnSelectedArray } = props;
  const setDialogInfo = useDialogContext();
  // Set an empty placeholder for workflow status
  const [workflowStatus, setWorkflowStatus] = useState<Record<string, any>>({});

  useEffect(() => {
    let componentUnmount = false;
    const fetchData = async () => {
      try {
        if (!metadata.completed_workflows) {
          if (metadata.workflows.length > 0) {
            // Construct workflow query param string
            let queryPath = '/workflows/';

            // Add query to status toolbar to the query
            const parameterString = createQueryParameterFromArray('id', metadata.workflows);
            queryPath = queryPath.concat('?', parameterString);

            const responseWorkflow = (await AmplifyApiCall.get(
              'DataPortalApi',
              queryPath,
              {}
            )) as any;

            metadata['completed_workflows'] = responseWorkflow?.results;
          } else {
            metadata['completed_workflows'] = [];
          }
        }

        const groupedWorkflow = groupWorkflow(metadata['completed_workflows'], workflow_list);

        if (componentUnmount) return;
        setWorkflowStatus(groupedWorkflow);
      } catch (err) {
        console.error(err);
        setDialogInfo({
          isOpen: true,
          dialogTitle: 'Error',
          dialogContent: ''.concat(
            'Sorry, An error has occured when fetching metadata. Please try again!\n',
            '\nError:',
            err as string
          ),
        });
      }
    };
    if (workflow_list) {
      fetchData();
    }

    return () => {
      componentUnmount = true;
    };
  }, [metadata, workflow_list, setDialogInfo]);

  return (
    <>
      <StyledTableRow>
        {columnSelectedArray.map((field_name: string, index: number) => (
          <TableCell key={index} sx={{ textAlign: 'center', overflowWrap: 'anywhere' }}>
            {field_name === 'subject_id' ? (
              <Link
                underline='hover'
                color='black'
                href={'https://' + DATA_PORTAL_CLIENT_DOMAIN + '/subjects/' + metadata[field_name]}>
                <Typography>
                  {`${metadata[field_name]}` === 'null' ? '-' : `${metadata[field_name]}`}
                </Typography>
              </Link>
            ) : (
              <Typography>
                {`${metadata[field_name]}` === 'null' ? '-' : `${metadata[field_name]}`}
              </Typography>
            )}
          </TableCell>
        ))}

        {workflow_list.map((field_name: string, index: number) => (
          <TableCell key={index} sx={{ textAlign: 'center', position: 'relative', width: '105px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {workflowStatus[field_name] ? (
                <StatusChip status={workflowStatus[field_name]} />
              ) : (
                <Box>
                  <CircularProgress size='1.75rem' />
                </Box>
              )}
            </div>
          </TableCell>
        ))}
      </StyledTableRow>
    </>
  );
}

export default StatusRow;
