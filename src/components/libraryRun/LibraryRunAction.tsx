import { useState, useEffect } from 'react';
import { AmplifyApiCall } from '../../utils/AmplifyApiCall';
import { useLocation } from 'react-router-dom';

import grey from '@mui/material/colors/grey';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';

// Custom Components
import Pagination from '../../utils/Pagination';
import StatusIndex from '../status/StatusIndex';
import { useDialogContext } from '../../utils/DialogComponent';
import { useStatusToolbarContext } from '../status/StatusToolbar';
import { createQueryParameterFromArray } from '../../utils/Constants';
// A custom hook that builds on useLocation to parse
// the query string
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

type QueryParameterType = {
  rowsPerPage: number;
  search: string;
};

async function getQueryMetadata(queryParameter: QueryParameterType, toolbarStatusArray: any) {
  let display_field_list = [] as any[];

  let queryPath = '/libraryrun/';

  // Add query to status toolbar to the query
  if (toolbarStatusArray?.length > 0) {
    const parameterString = createQueryParameterFromArray(
      'workflows__end_status',
      toolbarStatusArray
    );
    queryPath = queryPath.concat('?', parameterString);
  }

  // Api Calls to LibraryRun to get list of Metadata
  const responseLibraryRun = (await AmplifyApiCall.get(
    'DataPortalApi',
    queryPath,
    queryParameter
  )) as any;

  const libraryRunList = responseLibraryRun.results;
  const paginationResult = responseLibraryRun.pagination;

  // For each libraryRun list, fetch metadata
  for (const libraryRun of libraryRunList) {
    const queryParams = {
      library_id: libraryRun.library_id,
    };
    const responseMetadata = (await AmplifyApiCall.get(
      'DataPortalApi',
      '/metadata',
      queryParams
    )) as any;
    const metadata_result = responseMetadata.results[0];

    // Expected data to extract from metadata and libraryRun
    // {
    //   library_id:
    //   sample_id:
    //   subject_id:
    //   workflows: [{workflowId}]
    // }

    const extract_data = {
      ...metadata_result,
      ...libraryRun,
    };

    display_field_list = [...display_field_list, extract_data];
  }
  return { pagination: paginationResult, results: display_field_list };
}

function LibraryRunAction() {
  const [metadataList, setMetadataList] = useState<any[]>([]);
  const setDialogInfo = useDialogContext();
  const [isLoading, setIsLoading] = useState(true);
  const toolbarState = useStatusToolbarContext();
  // Get any searched value
  const query = useQuery();
  const searchValue = query.get('search');

  // PAGINATION
  const [queryParameter, setQueryParameter] = useState({ rowsPerPage: 50, search: '' });
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 50,
    count: 0,
  });

  function handleChangeQuery(value: Partial<QueryParameterType> | number) {
    setQueryParameter(value as QueryParameterType);
  }

  useEffect(() => {
    let componentUnmount = false;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let metadataListResult: any[] = [];

        let queryParams = {
          ...queryParameter,
        };
        if (searchValue) {
          queryParams = {
            ...queryParams,
            search: searchValue,
          };
        }

        const responseMetadata = await getQueryMetadata(queryParams, toolbarState.status);
        metadataListResult = responseMetadata.results;
        const paginationResult = responseMetadata.pagination;

        // Do Not update state on unmount
        if (componentUnmount) return;
        setMetadataList(metadataListResult);
        setPagination(paginationResult);
      } catch (err) {
        console.error(err);
        setDialogInfo({
          isOpen: true,
          dialogTitle: 'Error',
          dialogContent: 'Sorry, An error has occured while fetching metadata. Please try again!',
        });
      }
      setIsLoading(false);
    };

    fetchData();

    return () => {
      componentUnmount = true;
    };
  }, [searchValue, queryParameter, setDialogInfo, toolbarState.status]);

  return (
    <div>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <TableContainer
          component={Paper}
          elevation={2}
          sx={{
            borderRadius: '10px',
            marginBottom: '20px',
            backgroundColor: grey[50],
          }}>
          <StatusIndex metadataList={metadataList} />
          <Pagination
            pagination={pagination}
            handleChangeQuery={handleChangeQuery}
            paginationName='metadata'
          />
        </TableContainer>
      )}
    </div>
  );
}

export default LibraryRunAction;
