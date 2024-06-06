import Chip from '@mui/material/Chip';
import green from '@mui/material/colors/green';
import orange from '@mui/material/colors/orange';
import red from '@mui/material/colors/red';
import brown from '@mui/material/colors/brown';

// Color selection based on https://materialui.co/colors/ color palette
// Color name from the color header and numbers are color Id

function getStyleForStatus(status: any, isSelected: boolean) {
  const baseStyle = { fontWeight: 'Medium', border: '' };

  if (isSelected) {
    baseStyle['border'] = '2px solid';
  }

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

function StatusChip({ status, isClick, handleClick }: any) {
  return <Chip onClick={handleClick} label={status} sx={getStyleForStatus(status, isClick)} />;
}

export default StatusChip;
