import Chip from '@mui/material/Chip';

import { green, orange, red, brown } from '@mui/material/colors';

function getStyleForStatus(status: any) {
  const baseStyle = { fontWeight: 'Medium', fontSize: '11px', margin: '0 0.25rem 0 0.25rem' };
  switch (status.toLowerCase()) {
    case 'succeeded':
      // Green color
      return { ...baseStyle, backgroundColor: green[100], color: green[900] };
    case 'started':
      // Orange color
      return { ...baseStyle, backgroundColor: orange[100], color: orange[800] };
    case 'running':
      // Orange color
      return { ...baseStyle, backgroundColor: orange[100], color: orange[800] };
    case 'failed':
      // Pink color
      return { ...baseStyle, backgroundColor: red[100], color: red[400] };
    case 'aborted':
      // Brown color
      return { ...baseStyle, backgroundColor: brown[100], color: brown[500] };
    default:
      // Default style for unknown type
      return { ...baseStyle };
  }
}

function SequenceRunChip({ label, status }: { label: string; status: string }): React.JSX.Element {
  return <Chip label={label} sx={getStyleForStatus(status)} />;
}

export default SequenceRunChip;
