import { Grid, Typography } from '@mui/material';

// import LibraryRunAction from '../../components/libraryRun/LibraryRunAction';
// import StatusToolbar from '../../components/status/StatusToolbar';
import BasicFlow from '../../components/diagram';

function DiagramPage() {
  return (
    <>
      <Grid item container justifyContent='center'>
        <Typography variant='h4' gutterBottom>
          Digram
        </Typography>
      </Grid>
      <Grid item container xs={12} direction={'column'}>
        <div style={{ height: '500px', width: '1300px', overflow: 'auto' }}>
          <BasicFlow />
        </div>
      </Grid>
      <Grid item xs={12}>
        {/* <StatusToolbar>
          <LibraryRunAction />
        </StatusToolbar> */}
      </Grid>
    </>
  );
}

export default DiagramPage;
