// Workflow Filter Status Bar
export const WORKFLOW_STATUS = ['Succeeded', 'Running', 'Aborted', 'Failed'];

// Workflow filter length for comparison
export const WORKFLOW_STATUS_LENGTH = WORKFLOW_STATUS.length;

export const WorkflowTypeEquivalence: { [key: string]: string } = {
  BCL_CONVERT: 'bcl_convert',
  DRAGEN_WGS_QC: 'wgs_alignment_qc',
  TUMOR_NORMAL: 'wgs_tumor_normal',
  DRAGEN_TSO_CTDNA: 'tso_ctdna_tumor_only',
  DRAGEN_WTS: 'wts_tumor_only',
  UMCCRISE: 'umccrise',
  ONCOANALYSER_WGS: 'oncoanalyser_wgs',
  SASH: 'sash',
  ONCOANALYSER_WGTS_BOTH: 'oncoanalyser_wgts_existing_both',
  DRAGEN_WTS_QC: 'wts_alignment_qc',
  RNASUM: 'rnasum',
  STAR_ALIGNMENT: 'star_alignment',
  ONCOANALYSER_WTS: 'oncoanalyser_wts',
};

// Workflow order
// The key is extracted from metadata type
export const WORKFLOW_PIPELINE: { [key: string]: string[] } = {
  WGS: [
    'DRAGEN_WGS_QC',
    'TUMOR_NORMAL',
    'UMCCRISE',
    'ONCOANALYSER_WGS',
    'SASH',
    'ONCOANALYSER_WGTS_BOTH',
  ],
  WTS: [
    'DRAGEN_WTS_QC',
    'DRAGEN_WTS',
    'RNASUM',
    'STAR_ALIGNMENT',
    'ONCOANALYSER_WTS',
    'ONCOANALYSER_WGTS_BOTH',
  ],
  ctTSO: ['DRAGEN_TSO_CTDNA', 'UMCCRISE'],
  ctDNA: ['DRAGEN_TSO_CTDNA', 'UMCCRISE'],
};

// Workflow Types Available
export const SUPPORTED_PIPELINE = Object.keys(WORKFLOW_PIPELINE);

// Column Display for the Status Table
// Default displayed columns: library_id, subject_id, sample_id, phenotype
export const STATUS_COLUMN_DISPLAY = {
  library_id: true,
  subject_id: true,
  sample_id: true,
  assay: false,
  coverage: false,
  coverage_yield: false,
  experiment_id: false,
  external_sample_id: false,
  external_subject_id: false,
  instrument_run_id: false,
  lane: false,
  override_cycles: false,
  phenotype: true,
  project_name: false,
  project_owner: false,
  qc_pass: false,
  qc_status: false,
  quality: false,
  run_id: false,
  sample_name: false,
  source: false,
  truseqindex: false,
  type: false,
  valid_for_analysis: false,
  workflow: false,
};

// Column Display for the Workflow Table
// Default displayed columns: wfr_name, wfr_id, type_name, end_status, end
export const WORKFLOW_COLUMN_DISPLAY = {
  wfr_name: true,
  wfr_id: true,
  type_name: true,
  end_status: true,
  start: false,
  end: true,
  id: false,
  sample_name: false,
  portal_run_id: false,
  wfl_id: false,
  wfv_id: false,
  version: false,
  input: false,
  output: false,
  notified: false,
  sequence_run: false,
  batch_run: false,
};

// Get workflow pipeline
export function getWorkflowPipeline(pipelineType: any) {
  const pipeline = WORKFLOW_PIPELINE[pipelineType];
  if (pipeline) {
    return pipeline;
  }
  return [];
}

// Raw field name
export const FIELD_TO_DISPLAY = ['library_id', 'subject_id', 'sample_id'];

// Construct a string
export function createQueryParameterFromArray(key_string: string, value_array: string[]) {
  let queryString = '';

  for (const value of value_array) {
    queryString = queryString.concat(key_string, '=', value, '&');
  }

  if (queryString.slice(-1) === '&') {
    queryString = queryString.slice(0, -1);
  }

  return queryString;
}

// Grouped data based on object key
export function groupListBasedOnKey(objectList: any, key: any) {
  const groupedObject: { [key: string]: any } = {};
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
export function uniqueArray(array: any[]) {
  return [...new Set(array)];
}

// export function uniqueArray(array: any[]) {
//   var a = array.concat();
//   for (var i = 0; i < a.length; ++i) {
//     for (var j = i + 1; j < a.length; ++j) {
//       if (a[i] === a[j]) a.splice(j--, 1);
//     }
//   }

//   return a;
// }

// Convert raw field name to displayed UI name (Capitalize Word)
export function convertToDisplayName(str: string) {
  const frags = str.split('_');
  for (let i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(' ');
}

// Convert time to Locale
export function getDateTimeString(iso_string: string) {
  const dateTime = new Date(iso_string);
  return dateTime.toLocaleString('en-GB');
}

export const mock_metadata = [
  {
    library_id: 'L0000000',
    sample_id: 'PRJ210000',
    subject_id: 'SBJ00000',
    type: 'WTS',
  },
  {
    library_id: 'L0000000',
    sample_id: 'PRJ210000',
    subject_id: 'SBJ00000',
    type: 'WTS',
  },
  {
    library_id: 'L0000000',
    sample_id: 'PRJ210000',
    subject_id: 'SBJ00000',
    type: 'WTS',
  },
  {
    library_id: 'L0000000',
    sample_id: 'PRJ210000',
    subject_id: 'SBJ00000',
    type: 'WTS',
  },

  {
    library_id: 'L0000000',
    sample_id: 'PRJ210000',
    subject_id: 'SBJ00000',
    type: 'WGS',
  },
  {
    library_id: 'L0000000',
    sample_id: 'PRJ210000',
    subject_id: 'SBJ00000',
    type: 'WGS',
  },
  {
    library_id: 'L0000000',
    sample_id: 'PRJ210000',
    subject_id: 'SBJ00000',
    type: 'WGS',
  },
  {
    library_id: 'L0000000',
    sample_id: 'PRJ210000',
    subject_id: 'SBJ00000',
    type: 'WGS',
  },

  {
    library_id: 'L0000000',
    sample_id: 'PRJ210000',
    subject_id: 'SBJ00000',
    type: 'ctTSO',
  },
  {
    library_id: 'L0000000',
    sample_id: 'PRJ210000',
    subject_id: 'SBJ00000',
    type: 'ctTSO',
  },
  {
    library_id: 'L0000000',
    sample_id: 'PRJ210000',
    subject_id: 'SBJ00000',
    type: 'ctTSO',
  },
  {
    library_id: 'L0000000',
    sample_id: 'PRJ210000',
    subject_id: 'SBJ00000',
    type: 'ctTSO',
  },
];

export const mock_sequence_run = [
  {
    date_modified: '2021-09-25T01:44:01.730166Z',
    status: 'New',
    name: '210923_A00000_0123_ABCDEFG',
    instrument_run_id: '210923_A00000_0123_ABCDEFG',
  },
  {
    date_modified: '2021-09-25T01:44:01.730166Z',
    status: 'Uploading',
    name: '210923_A00000_0123_ABCDEFG',
    instrument_run_id: '210923_A00000_0123_ABCDEFG',
  },
  {
    date_modified: '2021-09-25T01:44:01.730166Z',
    status: 'Complete',
    name: '210923_A00000_0123_ABCDEFG',
    instrument_run_id: '210923_A00000_0123_ABCDEFG',
  },
  {
    date_modified: '2021-09-25T01:44:01.730166Z',
    status: 'Complete',
    name: '210923_A00000_0123_ABCDEFG',
    instrument_run_id: '210923_A00000_0123_ABCDEFG',
  },
  {
    date_modified: '2021-09-25T01:44:01.730166Z',
    status: 'Complete',
    name: '210923_A00000_0123_ABCDEFG',
    instrument_run_id: '210923_A00000_0123_ABCDEFG',
  },
];
