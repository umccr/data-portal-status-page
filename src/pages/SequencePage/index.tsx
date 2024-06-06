import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import SequenceRunTable from '../../components/sequenceRun/SequenceRunTable';
import StatusToolbar from '../../components/status/StatusToolbar';

function SequencePage() {
  return (
    <>
      <Grid item container justifyContent='center'>
        <Typography variant='h4' gutterBottom>
          Recent Sequences
        </Typography>
      </Grid>
      <Grid item>
        {/* Wrap Filter component to be assesible by child */}
        <StatusToolbar>
          <SequenceRunTable />
        </StatusToolbar>
      </Grid>
    </>
  );
}

export default SequencePage;
