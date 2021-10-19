// Workflow Filter Status Bar
export const WORKFLOW_STATUS = ["Succeeded", "Running", "Failed", "Aborted"];

// Workflow filter length for comparison
export const WORKFLOW_STATUS_LENGTH = WORKFLOW_STATUS.length

// Workflow order
export const WORKFLOW_PIPELINE = {
  WGS: ["BCL_CONVERT", "DRAGEN_WGS_QC", "TUMOR_NORMAL"],
  WTS: ["BCL_CONVERT", "WTS"],
  ctTSO: ["BCL_CONVERT", "DRAGEN_TSO_CTDNA"],
};

// Workflow Types Available
export const SUPPORTED_PIPELINE = Object.keys(WORKFLOW_PIPELINE);

// Raw field name
export const FIELD_TO_DISPLAY = ["library_id", "subject_id", "sample_id"];

// Convert raw field name to displayed UI name (Capitalize Word)
export function convertToDisplayName(str) {
  let frags = str.split("_");
  for (let i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(" ");
}

// Convert time to Locale
export function getDateTimeString(iso_string) {
  let dateTime = new Date(iso_string);
  return dateTime.toLocaleString("en-GB");
}

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
