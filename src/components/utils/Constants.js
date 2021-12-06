// Workflow Filter Status Bar
export const WORKFLOW_STATUS = ["Succeeded", "Running", "Aborted", "Failed"];

// Workflow filter length for comparison
export const WORKFLOW_STATUS_LENGTH = WORKFLOW_STATUS.length;

export const WorkflowTypeEquivalence = {
  BCL_CONVERT: "bcl_convert",
  DRAGEN_WGS_QC: "wgs_alignment_qc",
  TUMOR_NORMAL: "wgs_tumor_normal",
  DRAGEN_TSO_CTDNA: "tso_ctdna_tumor_only",
  DRAGEN_WTS: "wts_tumor_only"
}

// Workflow order
export const WORKFLOW_PIPELINE = {
  WGS: ["DRAGEN_WGS_QC", "TUMOR_NORMAL"],
  WTS: ["DRAGEN_WTS"],
  ctTSO: ["DRAGEN_TSO_CTDNA"],
};

// Workflow Types Available
export const SUPPORTED_PIPELINE = Object.keys(WORKFLOW_PIPELINE);

// Get workflow pipeline
export function getWorkflowPipeline(pipelineType) {
  const pipeline = WORKFLOW_PIPELINE[pipelineType];
  if (pipeline) {
    return pipeline;
  }
  return [];
}

// Raw field name
export const FIELD_TO_DISPLAY = ["library_id", "subject_id", "sample_id"];

// Grouped data based on object key
export function groupListBasedOnKey(objectList, key) {
  const groupedObject = {};
  for (const object of objectList) {
    const objectKey = object[key];

    if (groupedObject[objectKey]) {
      groupedObject[objectKey] = [...groupedObject[objectKey], object];
    } else {
      groupedObject[objectKey] = [object];
    }
  }
  return groupedObject;
}

// De-duplicate values in the array
export function uniqueArray(array) {
  var a = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }

  return a;
}

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
