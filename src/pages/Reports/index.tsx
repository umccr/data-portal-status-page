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
