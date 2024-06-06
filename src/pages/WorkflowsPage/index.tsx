import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import CustomTable from '../../components/workflows/WorkflowTable';
import { useDialogContext } from '../../utils/DialogComponent';
import { AmplifyApiCall } from '../../utils/AmplifyApiCall';

interface Workflow {
  // Define the structure of your workflow object here
}

interface PaginationResult {
  page: number;
  rowsPerPage: number;
  count: number;
}

interface QueryParameterType {
  rowsPerPage: number;
  ordering: string;
  search: string;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function WorkflowTable() {
  const [workflowList, setWorkflowList] = useState<Workflow[]>([]);

  const setDialogInfo = useDialogContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const query = useQuery();
  const searchValue = query.get('search');

  const [queryParameter, setQueryParameter] = useState<QueryParameterType>({
    rowsPerPage: 300,
    ordering: '-id',
    search: '',
  });

  const [pagination, setPagination] = useState<PaginationResult>({
    page: 0,
    rowsPerPage: 300,
    count: 0,
  });

  function handleChangeQuery(value: QueryParameterType) {
    setQueryParameter(value);
  }

  useEffect(() => {
    let componentUnmount = false;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let queryParams = {
          ...queryParameter,
        };
        if (searchValue) {
          queryParams = {
            ...queryParams,
            search: searchValue,
          };
        }

        const workflowResponse = (await AmplifyApiCall.get(
          'DataPortalApi',
          '/workflows',
          queryParams
        )) as any;

        const newWorkflowList = workflowResponse.results;
        const paginationResult = workflowResponse.pagination;

        if (componentUnmount) return;
        setWorkflowList(newWorkflowList);
        setPagination(paginationResult);
      } catch (err) {
        console.error(err);
        setDialogInfo({
          isOpen: true,
          dialogTitle: 'Error',
          dialogContent: 'Sorry, An error has occurred while fetching workflows. Please try again!',
        });
      }
      setIsLoading(false);
    };

    fetchData();

    return () => {
      componentUnmount = true;
    };
  }, [setDialogInfo, queryParameter, searchValue]);

  return (
    <Grid container direction='row' justifyContent='center' alignItems='flex-start' spacing={3}>
      <Grid item xs={12}>
        <Typography sx={{ display: 'flex', justifyContent: 'center' }} variant='h4'>
          Recent Workflows
        </Typography>
      </Grid>

      {isLoading ? (
        <CircularProgress sx={{ marginTop: '50px' }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              ordering={queryParameter.ordering}
              items={workflowList}
              paginationProps={pagination}
              handleChangeQuery={handleChangeQuery}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
