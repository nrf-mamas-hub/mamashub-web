import * as yup from 'yup';

const broadClinicalReview = {
  'Clinical Review': [
    {
      name: 'ageAtFirstContact',
      label: 'Age at first contact',
      type: 'text',
      validate: yup.number().required('Age at first contact is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 3,
      },
    },
    {
      name: 'weight',
      label: "Weight (gms)",
      type: 'text',
      validate: yup.number().required("Weight is required"),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 3,
      },
    },
    {
      name: 'lengthOrHeight',
      label: "Length/height (cm)",
      type: 'text',
      validate: yup.number().required("Length/height is required"),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 3,
      },
    },
    {
      name: 'zScore',
      label: "Z score",
      type: 'text',
      validate: yup.number().required("Z score is required"),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 3,
      },
    },
    {
      name: 'hivStatus',
      label: 'HIV status',
      type: 'radio',
      validate: yup.string().required('HIV Status is required'),
      options: [
        { label: 'Exposed', value: 'Exposed' },
        { label: 'Reactive', value: 'Reactive' },
        { label: 'Non Reactive', value: 'Non Reactive' },
        { label: 'Unknown', value: 'Unknown' },
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
    },
    {
      name: 'hivStatusExposedDate',
      label: 'If exposed, provide date',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      relevant: formValues => formValues.hivStatus === 'Exposed',
    },
    {
      name: 'hivStatusNonReactiveDate',
      label: 'If non reactive, provide date',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      relevant: formValues => formValues.hivStatus === 'Non Reactive',
    },
    {
      name: 'haemoglobin',
      label: 'Haemoglobin (HB)',
      type: 'text',

      validate: yup
        .number('Haemoglobin must be a number')
        .required('Haemoglobin is required'),

      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
    },
  ],
  'Physical Features': [    
    {
      name: 'colouration',
      label: 'Colouration (cyanosis/jaundice/macules/hypopigmentation)',
      type: 'text',

      validate: yup.string().required('Colouration is required'),

      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 3,
      },
    },
    {
      name: 'headCircumference',
      label: 'Head circumference (cm)',
      type: 'text',
      validate: yup.number().required('Head circumference is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 3,
      },
    },
    {
      name: 'eyes',
      label: 'Eyes',
      type: 'text',

      validate: yup.string().required('Eyes is required'),

      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 3,
      },
    },
    {
      name: 'ears',
      label: 'Ears',
      type: 'text',

      validate: yup.string().required('Ears is required'),

      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 3,
      },
    },
    {
      name: 'mouth',
      label: 'Mouth',
      type: 'text',

      validate: yup.string().required('Mouth is required'),

      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 3,
      },
    },
    {
      name: 'chest',
      label: 'Chest',
      type: 'text',

      validate: yup.string().required('Chest is required'),

      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 3,
      },
    },
    {
      name: 'heart',
      label: 'Heart',
      type: 'text',

      validate: yup.string().required('Heart is required'),

      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 3,
      },
    },
    {
      name: 'abdomen',
      label: 'Abdomen',
      type: 'text',

      validate: yup.string().required('Abdomen is required'),

      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 3,
      },
    },
    {
      name: 'umbilicalCordsOrUmbilicus',
      label: 'Umbilical cord/umbilicus',
      type: 'text',

      validate: yup.string().required('Umbilical cord/umbilicus is required'),

      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 3,
      },
    },
    {
      name: 'spine',
      label: 'Spine',
      type: 'text',

      validate: yup.string().required('Spine is required'),

      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 3,
      },
    },
    {
      name: 'armsAndHands',
      label: 'Arms & hands',
      type: 'text',

      validate: yup.string().required('Arms & hands is required'),

      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 3,
      },
    },
    {
      name: 'legsAndFeet',
      label: 'Legs & feet',
      type: 'text',

      validate: yup.string().required('Legs & feet is required'),

      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 3,
      },
    },
    {
      name: 'genitalia',
      label: 'Genitalia',
      type: 'radio',
      validate: yup.string().required('Genitalia is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        { label: 'Normal', value: 'Normal' },
        { label: 'Abnormal', value: 'Abnormal' },
      ],
    },
    {
      name: 'genitaliaAbnormalSpecify',
      label: 'Specify: Indeterminate, undescended testes/ hypospadiasis etc',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.genitalia === 'Abnormal',
    },
    {
      name: 'anus',
      label: 'Anus',
      type: 'radio',
      validate: yup.string().required('Anus is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        { label: 'Perforate (Normal)', value: 'Normal' },
        { label: 'Imperforate (Abnormal)', value: 'Abnormal' },
      ],
    },
  ],
};

export default broadClinicalReview;
