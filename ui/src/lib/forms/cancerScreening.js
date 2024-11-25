import * as yup from 'yup';

const cancerScreeningFields = {
  'Cervical Cancer Screening' : [
    
    //HPV
    {
      name: 'cervixHpvTest',
      label: 'HPV Test',
      type: 'radio',
      validate: yup.string().required('HPV test result is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
    },
    {
        name: 'cervixHpvScreeningDate',
        label: 'Date',
        type: 'date',
        validate: yup.date(),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 6,
        },
        relevant: formValues => formValues.cervixHpvTest === 'Yes',
      },
    {
        name: 'cervixHpvResult',
        label: 'If yes, specify the results',
        type: 'radio',
        validate: yup.string(),
        options: [
            { value: 'Negative', label: 'Negative' },
            { value: 'Positive', label: 'Positive' },
            { value: 'Suspicious for Cancer', label: 'Suspicious for cancer' },
          ], 
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,      
        },
        relevant: formValues => formValues.cervixHpvTest === 'Yes',
    },
    //HPV Treatment
    {
        name: 'cervixHpvTreatment',
        label: 'HPV Treatment',
        type: 'checkbox',
        validate: yup.array(),
        options: [
          { value: 'Referred', label: 'Referred' },
        ],
        width: {
          xs: 12,
          sm: 12,
          md: 8,
          lg: 6,
        },
        relevant: formValues => formValues.cervixHpvResult === 'Positive' || formValues.cervixHpvResult === 'Suspicious for Cancer',
    },
    //VIA
    {
      name: 'cervixViaTest',
      label: 'VIA Test',
      type: 'radio',
      validate: yup.string().required('VIA test result is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
    },
    {
        name: 'cervixViaScreeningDate',
        label: 'Date',
        type: 'date',
        validate: yup.date(),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 6,
        },
        relevant: formValues => formValues.cervixViaTest === 'Yes',
      },
    {
        name: 'cervixViaResult',
        label: 'If yes, specify the results',
        type: 'radio',
        validate: yup.string(),
        options: [
            { value: 'Negative', label: 'Negative' },
            { value: 'Positive', label: 'Positive' },
            { value: 'Suspicious for Cancer', label: 'Suspicious for cancer' },
          ],
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,       
        },
        relevant: formValues => formValues.cervixViaTest === 'Yes',
    },
    //VIA Treatment
    {
        name: 'cervixViaTreatment',
        label: 'VIA Treatment',
        type: 'checkbox',
        validate: yup.array(),
        options: [
          { value: 'Cryo', label: 'Cryo' },
          { value: 'Thermoablation', label: 'Thermoablation' },
          { value: 'Leep', label: 'LEEP' },
          { value: 'Referred', label: 'Referred' },
        ],
        width: {
          xs: 12,
          sm: 12,
          md: 8,
          lg: 6,
        },
        relevant: values => values.cervixViaResult === 'Positive' || values.cervixViaResult === 'Suspicious for Cancer',
    },
    //VIA/Vili
    {
        name: 'cervixViaViliTest',
        label: 'Via/Vili Test',
        type: 'radio',
        validate: yup.string().required('VIA test result is required'),
        width: {
          xs: 12,
          sm: 12,
          md: 8,
          lg: 6,
        },
        options: [
            {
              label: 'Yes',
              value: 'Yes',
            },
            {
              label: 'No',
              value: 'No',
            },
          ],
    },
    {
        name: 'cervixViaViliScreeningDate',
        label: 'Date',
        type: 'date',
        validate: yup.date(),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 6,
        },
        relevant: formValues => formValues.cervixViaViliTest === 'Yes',
      },
    {
        name: 'cervixViaViliResult',
        label: 'If yes, specify the results',
        type: 'radio',
        validate: yup.string(),
        options: [
            { value: 'Negative', label: 'Negative' },
            { value: 'Positive', label: 'Positive' },
            { value: 'Suspicious for Cancer', label: 'Suspicious for cancer' },
          ],
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,     
        },
        relevant: formValues => formValues.cervixViaViliTest === 'Yes',
    },
    {
      name: 'cervixViaViliTreatment',
      label: 'ViaVili Treatment',
      type: 'checkbox',
      validate: yup.array(),
      options: [
        { value: 'Cryo', label: 'Cryo' },
        { value: 'Thermoablation', label: 'Thermoablation' },
        { value: 'Leep', label: 'LEEP' },
        { value: 'Referred', label: 'Referred' }, 
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      relevant: values => values.cervixViaViliResult === 'Positive' || values.cervixViaViliResult === 'Suspicious for Cancer',
    },
    //Pap Smear
    {
      name: 'cervixPapSmearTest',
      label: 'Pap Smear Test',
      type: 'radio',
      validate: yup.string().required('Pap smear result is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
    },
    {
      name: 'cervixPapSmearScreeningDate',
      label: 'Date',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.cervixPapSmearTest === 'Yes',
    },
    {
        name: 'cervixPapSmearResult',
        label: 'If yes, specify the results',
        type: 'radio',
        validate: yup.string(),
        options: [
            { value: 'Normal', label: 'Normal' },
            { value: 'Ascus Or Greater', label: 'ASCUS or greater*' },
            { value: 'Suspicious for Cancer', label: 'Suspicious for cancer' },
          ], 
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,    
        },
        relevant: formValues => formValues.cervixPapSmearTest === 'Yes',
    },
    
    {
      name: 'cervixPapSmearTreatment',
      label: 'Pap Smear Treatment',
      type: 'checkbox',
      validate: yup.array(),
      options: [
        { value: 'Cryo', label: 'Cryo' },
        { value: 'Thermoablation', label: 'Thermoablation' },
        { value: 'Leep', label: 'LEEP' },
        { value: 'Referred', label: 'Referred' },
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      relevant: values => values.cervixPapSmearResult === 'Ascus Or Greater' || values.cervixPapSmearResult === 'Suspicious for Cancer',
    },
    
  ],

  'Breast Cancer Screening': [
    
    {
      name: 'breastCbeTest',
      label: 'CBE Test',
      type: 'radio',
      validate: yup.string().required('CBE result is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
    },
    {
        name: 'breastCbeScreeningDate',
        label: 'Date',
        type: 'date',
        validate: yup.date(),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 6,
        },
        relevant: formValues => formValues.breastCbeTest === 'Yes',
      },
    {
        name: 'breastCbeResult',
        label: 'If yes, specify the results',
        type: 'radio',
        validate: yup.string(),
        options: [
            { value: 'Normal', label: 'Normal' },
            { value: 'Benign Lump', label: 'Benign Lump' },
            { value: 'Suspicious Lump', label: 'Suspicious lump' },
          ],
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,    
        },
        relevant: formValues => formValues.breastCbeTest === 'Yes',
    },
    {
      name: 'breastCbeTreatment',
      label: 'CBE Treatment',
      type: 'checkbox',
      validate: yup.array(),
      options: [
        { value: 'FNA', label: 'FNA' },
        { value: 'Excision', label: 'Excision' },
        { value: 'Others', label: 'Others' },
        { value: 'Referred', label: 'Referred' },
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      relevant: values => values.breastCbeResult === 'Benign Lump' || values.breastCbeResult === 'Suspicious Lump',
    },
    {
        name: 'breastCbeTreatmentOthersSpecify',
        label: 'Others (Specify)',
        type: 'text',
        validate: yup.string().when(['breastCbeTreatment'], {
          is: (breastCbeTreatment) => Array.isArray(breastCbeTreatment) && breastCbeTreatment.includes('Others'),
          then: (schema) => schema.required('Please specify other treatment'),
          otherwise: (schema) => schema
        }),
        width: {
          xs: 12,
          sm: 12,
          md: 8,
          lg: 6,
        },
        relevant: values => values.breastCbeTreatment && values.breastCbeTreatment.includes('Others')
      },
    //Ultrasound
    {
      name: 'breastUltrasoundTest',
      label: 'Ultrasound Test',
      type: 'radio',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],  
      relevant: values => values.breastCbeResult === 'Benign Lump' || values.breastCbeResult === 'Suspicious Lump',
    },
    {
        name: 'breastUltrasoundScreeningDate', 
        label: 'Date',
        type: 'date',
        validate: yup.date(),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 6,
        },
        relevant: formValues => formValues.breastUltrasoundTest === 'Yes',
      },
    {
        name: 'breastUltrasoundResult',
        label: 'If yes, specify the results',
        type: 'radio',
        validate: yup.string(),
        options: [
            { value: 'Normal', label: 'Normal' },
            { value: 'Abnormal', label: 'Abnormal' },
          ],
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,    
        },
        relevant: formValues => formValues.breastUltrasoundTest === 'Yes',
    },
    {
      name: 'breastUltrasoundTreatmentDiagnosisTreatmentIndicate',
      label: 'Diagnosis/Treatment indicate',
      type: 'textarea',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.breastUltrasoundResult === 'Abnormal',
    },
    {
      name: 'breastUltrasoundTreatmentReferral',
      label: 'Ultrasound Referral',
      type: 'checkbox',
      validate: yup.array(),
      options: [
        { value: 'Referred', label: 'Referred' },
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 4,
        lg: 3,
      },
      relevant: formValues => formValues.breastUltrasoundResult === 'Abnormal',
    },
  ],
};

export default cancerScreeningFields;
