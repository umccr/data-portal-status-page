import { Grid, Typography } from '@mui/material';

import LibraryRunAction from '../../components/libraryRun/LibraryRunAction';
import StatusToolbar from '../../components/status/StatusToolbar';

function LibraryRunPage() {
  return (
    <>
      <Grid item container justifyContent='center'>
        <Typography variant='h4' gutterBottom>
          Recent Library Runs
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <StatusToolbar>
          <LibraryRunAction />
        </StatusToolbar>
      </Grid>
    </>
  );
}

export default LibraryRunPage;
