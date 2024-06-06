import { useState } from 'react';
import { Button, Modal, Typography, Box } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// Sample HTML content for reports
const reports = [
  {
    title: 'Report 1',
    content: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Report 1</title>
      </head>
      <body>
      <h1>Report 1</h1>
      <p>This is the content of Report 1.</p>
      </body>
      </html>
    `,
  },
  {
    title: 'Report 2',
    content: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Report 2</title>
      </head>
      <body>
      <h1>Report 2</h1>
      <p>This is the content of Report 2.</p>
      </body>
      </html>
    `,
  },
];

// React component to list reports and display them in a modal
const Reports = () => {
  const [open, setOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<{ title: string; content: string } | null>(
    null
  );

  const handleOpen = (report: any) => {
    setSelectedReport(report);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReport(null);
  };

  return (
    <div>
      <Typography variant='h4' gutterBottom>
        Report List
      </Typography>
      <ul>
        {reports.map((report, index) => (
          <li key={index}>
            <Button onClick={() => handleOpen(report)}>{report.title}</Button>
          </li>
        ))}
      </ul>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Box sx={style}>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            <div dangerouslySetInnerHTML={{ __html: selectedReport?.content || '' }} />
          </Typography>
          {/* https://stratus-gds-aps2.s3.amazonaws.com/1f412e89-acc8-4337-b484-08d89d4636a9/analysis_data/SBJ04376/umccrise/20231019769d9929/L2301198__L2301197/SBJ04376__MDX230464/SBJ04376__MDX230464-multiqc_report.html?response-content-type=text%2Fhtml&response-content-disposition=inline&AWSAccessKeyId=ASIARFCPI2IGQTZBPTOR&Signature=Ea0ocyXzZ2w2Z95SV1N8a67e5RQ%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEO7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC0yIkcwRQIgX4YlonnJIlQRMvaT9ppszx3FAikK%2BoFJYIS%2BigXdZGsCIQDzyrDCE7m4ZyfyyNhOUAIxqdE1L7w7NXDVi58RMSiyNyrnBAgnEAUaDDA3OTYyMzE0ODA0NSIMtFIX2LwiH%2BOHegeJKsQE7W%2BrbmW84bSdLXZq05M1BTMrb6u6kl%2F29XvvWnZ7%2BaJBWQKrKNfdqmBTuq0vL7xBO50vAaxfDPpTs9OVoH%2BLde6esB3LDlUHLzxChwUtZlmSA3G5%2BIfjjp6pdCxnaN9HlmN5vLpV3fzjjjWo%2BZdwmSLELpN67m%2BXQjJ8iyeziD4h62EpzTSFUubEHCl6uY17eSLVUvlfdwPwyWqPGEwQmhec52JLPo4AvM3gT4TYdfEZHPYikVBd33i0UD%2FLXI18BTYCZJbvf%2Fz1xEtghTI976jBevUZXRhL%2BT1sLW0tDfVZ13%2BU1v5ojH2ODX8cnnJF3yhLYtUWgjf%2BKuxlMgU88kVdv8DOt8lbbGWnz7c2FXDgg2dL3lNLSPBc1SbSsMmiGmAb4g7jCSZAE6u%2BwWGhBU73kL4WGjxtIe%2B6QYKAKaemtv07LZ%2Fr4SuZwNu73glYexlxKAexP%2BCa%2BiOQCdDL1iahYrSGOo3nVXjAVdDqTDW7pRqh4sxYoaERdMbe0IYH4Q1enQ8hXat7WKEbfccHPgk1S3KfM6PLu379THXXwIMkUYEvqyp4NjYljcBIaRiijZJwyG%2B7UU7P8B307pIHolUEG00g14RM7KU%2F2lKbIt3t8%2FdNTbo%2FE6%2BmFdzt0i28Q82L7zznirWrR%2BChav%2F10nC19I50yJGAre3WwfhGWMLeFQetB2IzudvcwcFhQwi4AvAvsGXrikzruBipyw4AJSBU%2B8mdSPLj9Ph1onKbyTikOL2Uls2zJub%2Bp3TPdu6WJZaImDDa1NiwBjqZAZLoXmonLhiw3W3rXUuc6ZfmtXTtU%2FnJXeQTBc6ZxO83QpsyIMEFutPBsJ%2FHUTZ379No4FNzYP3Ij6qIpX24NliAiBuB%2B8OYhtfEEKolHtJopIhA%2FwnINWLWPcbWtRMrRdwbQ2lpd2DW5eRfzV2DRXSNZzaeXiudKy5GNZEB16kmdLS0HqiMVE8S0KSuWozfp7xyTOODU8tydw%3D%3D&Expires=1712732266 */}
          <iframe
            title='Local HTML Page'
            src='/Callable cancer loci - SBJ04376__MDX230464.html'
            width='100%'
            height='500px'></iframe>
        </Box>
      </Modal>
    </div>
  );
};

export default Reports;
