export const WORKFLOW_STATUS = [
  "Succeeded",
  "Started",
  "Failed",
  "Aborted",
  "Pending",
];

// Workflow order
export const WORKFLOW_PIPELINE = {
  WGS: ["BCL_CONVERT", "DRAGEN_WGS_QC", "TUMOR_NORMAL"],
  WTS: ["BCL_CONVERT", "WTS"],
  ctTSO: ["BCL_CONVERT", "DRAGEN_TSO_CTDNA"],
};

// Raw field name
export const FIELD_TO_DISPLAY = ["library_id", "subject_id", "sample_id"];

// Convert raw field name to displayed UI name
export const CONVERT_TO_DISPLAY_NAME = {
  library_id: "Library Id",
  subject_id: "Subject Id",
  sample_id: "Sample Id",
};

export const mock_metadata = [
  {
    library_id: "L0000000",
    sample_id: "PRJ210000",
    subject_id: "SBJ00000",
    type: "WTS",
  },
  {
    library_id: "L0000000",
    sample_id: "PRJ210000",
    subject_id: "SBJ00000",
    type: "WTS",
  },
  {
    library_id: "L0000000",
    sample_id: "PRJ210000",
    subject_id: "SBJ00000",
    type: "WTS",
  },
  {
    library_id: "L0000000",
    sample_id: "PRJ210000",
    subject_id: "SBJ00000",
    type: "WTS",
  },
  {
    library_id: "L0000000",
    sample_id: "PRJ210000",
    subject_id: "SBJ00000",
    type: "WGS",
  },
  {
    library_id: "L0000000",
    sample_id: "PRJ210000",
    subject_id: "SBJ00000",
    type: "WGS",
  },
  {
    library_id: "L0000000",
    sample_id: "PRJ210000",
    subject_id: "SBJ00000",
    type: "WGS",
  },
  {
    library_id: "L0000000",
    sample_id: "PRJ210000",
    subject_id: "SBJ00000",
    type: "WGS",
  },
  {
    library_id: "L0000000",
    sample_id: "PRJ210000",
    subject_id: "SBJ00000",
    type: "ctTSO",
  },
  {
    library_id: "L0000000",
    sample_id: "PRJ210000",
    subject_id: "SBJ00000",
    type: "ctTSO",
  },
  {
    library_id: "L0000000",
    sample_id: "PRJ210000",
    subject_id: "SBJ00000",
    type: "ctTSO",
  },
  {
    library_id: "L0000000",
    sample_id: "PRJ210000",
    subject_id: "SBJ00000",
    type: "ctTSO",
  },
];

export const mock_sequence_run = [
  {
    date_modified: "2021-09-25T01:44:01.730166Z",
    status: "New",
    name: "210923_A00000_0123_ABCDEFG",
    instrument_run_id: "210923_A00000_0123_ABCDEFG",
  },
  {
    date_modified: "2021-09-25T01:44:01.730166Z",
    status: "Uploading",
    name: "210923_A00000_0123_ABCDEFG",
    instrument_run_id: "210923_A00000_0123_ABCDEFG",
  },
  {
    date_modified: "2021-09-25T01:44:01.730166Z",
    status: "Complete",
    name: "210923_A00000_0123_ABCDEFG",
    instrument_run_id: "210923_A00000_0123_ABCDEFG",
  },
  {
    date_modified: "2021-09-25T01:44:01.730166Z",
    status: "Complete",
    name: "210923_A00000_0123_ABCDEFG",
    instrument_run_id: "210923_A00000_0123_ABCDEFG",
  },
  {
    date_modified: "2021-09-25T01:44:01.730166Z",
    status: "Complete",
    name: "210923_A00000_0123_ABCDEFG",
    instrument_run_id: "210923_A00000_0123_ABCDEFG",
  },
];
