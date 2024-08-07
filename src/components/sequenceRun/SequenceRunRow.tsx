import React, { useState, useEffect } from 'react';

import { AmplifyApiCall } from '../../utils/AmplifyApiCall';

// Material-UI component
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CircularProgress from '@mui/material/CircularProgress';
import { grey } from '@mui/material/colors';

// Custom Component
import { useDialogContext } from '../../utils/DialogComponent';
import SequenceRunChip from './SequenceRunChip';
import StatusIndex from '../status/StatusIndex';
import Pagination from '../../utils/Pagination';
import { useStatusToolbarContext } from '../status/StatusToolbar';
import {
  convertToDisplayName,
  getDateTimeString,
  createQueryParameterFromArray,
} from '../../utils/Constants';

function displayWithTypography(key: any, data: any, typograhyStyle: any) {
  'Display object with field in typography';
  return (
    <Typography variant='subtitle2' display='inline' sx={typograhyStyle}>
      {convertToDisplayName(key)}: {data}
    </Typography>
  );
}

type QueryParameterType = {
  rowsPerPage: number;
  ordering: string;
  search: string;
};

async function getMetadataFromInstrumentRunId(
  instrument_run_id: string,
  queryParameter: any,
  statusArray: any
) {
  let display_field_list = [] as any[];

  // Api Calls to LibraryRun to get list of Metadata
  const queryParams = {
    ...queryParameter,
    instrument_run_id: instrument_run_id,
  };

  let queryPath = '/libraryrun/';

  // Add query to status toolbar to the query
  if (statusArray?.length > 0) {
    const parameterString = createQueryParameterFromArray('workflows__end_status', statusArray);
    queryPath = queryPath.concat('?', parameterString);
  }

  const responseLibraryRun = (await AmplifyApiCall.get(
    'DataPortalApi',
    queryPath,
    queryParams
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

    // Compulsory data to extract from metadata and libraryRun
    // {
    //   library_id:
    //   sample_id:
    //   subject_id:
    //   workflows:
    // }

    const extract_data = {
      ...metadata_result,
      ...libraryRun,
    };

    display_field_list = [...display_field_list, extract_data];
  }
  return {
    pagination: paginationResult,
    results: display_field_list,
  };
}

function SequenceRunRow(props: any) {
  const { data } = props;
  const [isOpen, setIsOpen] = useState(false);
  const setDialogInfo = useDialogContext();

  const [isLoading, setIsLoading] = useState(false);
  const [dataToDisplay, setDataToDisplay] = useState<any[]>([]);
  const toolbarState = useStatusToolbarContext() as any;
  const statusArray = toolbarState?.status;

  // Prevent re-loading data by having state to check if data has loaded
  const [allowDataLoad, setAllowDataLoad] = useState(false);
  function handleExpandRowButton() {
    setIsOpen(!isOpen);
    setAllowDataLoad(true);
  }

  // PAGINATION
  const [queryParameter, setQueryParameter] = useState({
    rowsPerPage: 300,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 300,
    count: 0,
  });
  function handleChangeQuery(value: Partial<QueryParameterType>) {
    setQueryParameter(value as QueryParameterType);
  }

  // Use Effect is row is expand to fetch metadata List
  useEffect(() => {
    let componentUnmount = false;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const apiResponse = await getMetadataFromInstrumentRunId(
          data.instrument_run_id,
          queryParameter,
          statusArray
        );

        if (componentUnmount) return;
        setPagination(apiResponse.pagination);
        setDataToDisplay(apiResponse.results);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setDialogInfo({
          isOpen: true,
          dialogTitle: 'Error',
          dialogContent: 'Sorry, An error has occured while fetching metadata. Please try again!',
        });
      }
    };

    // A guard to only execute when is needed
    if (allowDataLoad) {
      fetchData();
    }

    return () => {
      componentUnmount = true;
    };
  }, [allowDataLoad, data.instrument_run_id, queryParameter, setDialogInfo, statusArray]);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ width: '100%' }}>
          <Grid
            container
            direction='row'
            justifyContent='flex-start'
            alignItems='center'
            paddingTop='10px'
            paddingBottom='10px'
            paddingRight='10px'>
            <Grid item container xs={1} justifyContent='center' alignItems='center'>
              <IconButton aria-label='expand row' size='small' onClick={handleExpandRowButton}>
                {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Grid>

            <Grid
              item
              xs={11}
              container
              direction='column'
              justifyContent='flex-start'
              alignItems='center'
              spacing={1}
              padding={0.5}>
              {/* Row for sequence run Name and status */}
              <Grid
                item
                container
                direction='row'
                justifyContent='space-between'
                alignItems='center'>
                <Grid item>
                  {displayWithTypography('instrument_run_id', data.instrument_run_id, {
                    fontWeight: 'bold',
                  })}
                </Grid>
                <Grid item>
                  <SequenceRunChip label='Sequencing' status={data.status} />
                  <SequenceRunChip label='BCL Convert' status={data.bclConvertStatus} />
                </Grid>
              </Grid>

              {/* Row for row_id and end_time */}
              <Grid
                item
                container
                direction='row'
                justifyContent='space-between'
                alignItems='flex-start'>
                {/* Place Holder for Number of Workflow has completed */}

                {/* <Grid item>
                {displayWithTypography(data, "number",{ fontWeight: "light" })}
                </Grid> */}
                <Grid item>
                  {data.end_time // Display end_time if exist otherwise start_time is displayed
                    ? displayWithTypography('end_time', getDateTimeString(data.end_time), {
                        fontWeight: 'light',
                      })
                    : displayWithTypography('start_time', getDateTimeString(data.start_time), {
                        fontWeight: 'light',
                      })}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            backgroundColor: grey[50],
            padding: 0,
            textAlign: 'center',
          }}>
          <Collapse in={isOpen} timeout='auto' unmountOnExit>
            {isLoading ? (
              <div style={{ padding: '20px' }}>
                <CircularProgress aria-label='circular-loader' />
              </div>
            ) : (
              <>
                <StatusIndex metadataList={dataToDisplay} />
                <Pagination
                  pagination={pagination}
                  handleChangeQuery={handleChangeQuery}
                  paginationName='Library Run'
                />
              </>
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default SequenceRunRow;
