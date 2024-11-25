import * as yup from 'yup';

const MotherPostNatalCare = {
    'Visit details': [
      {
        name: 'timingOfVisit',
        label: 'Timing of Visit',
        type: 'select',
        required: true,
        options: [
            { value: 'Within 48 hours', label: 'Within 48 hours' },
            { value: '1-2 weeks', label: '1-2 weeks' },
            { value: '4-6 weeks', label: '4-6 weeks' },
            { value: '4-6 months', label: '4-6 months'},
        ],
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.string().required('Timing of visit required'),
        },
        {
          name: 'dateOfVisit',
          label: 'Date/visit',
          type: 'date',
          required: true,
          width: { xs: 12, sm: 12, md: 12, lg: 4 },
          validate: yup.date().required('Date of visit is required'),
        },  
    ],
    'Blood pressure': [
      {
        name: 'bloodPressure',
        label: 'Blood Pressure',
        type: 'text',
        required: true,
        width: { xs: 12, sm: 12, md: 10, lg: 4 },
        validate: yup.string().required('Blood pressure is required'),
      },
    ],
    'Temperature': [
      {
        name: 'motherTemperature',
        label: 'Temperature',
        type: 'text',
        required: true,
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.number().required('Temperature is required'),
      },
    ],
    'Vitals': [
      {
        name: 'pulse',
        label: 'Pulse',
        type: 'text',
        required: true,
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.number().required('Pulse is required'),
      },
      {
        name: 'respiratoryRate',
        label: 'Respiratory Rate',
        type: 'text',
        required: true,
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.number().required('Respiratory rate is required'),
      },
    ],
    'General condition': [
      {
        name: 'generalCondition',
        label: 'General Condition',
        type: 'text',
        required: true,
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.string().required('General condition is required'),
      },
    ],
    'Breast and Uterine health': [
      {
        name: 'breast',
        label: 'Breast',
        type: 'text',
        required: true,
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.string().required('Breast condition is required')
      },
      {
        name: 'involutionOfUterus',
        label: 'Involution of uterus',
        type: 'text',
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.string().required('Involution of uterus is required')
      },
    ],
    'Surgical History': [
      {
        name: 'caeserianSectionScar',
        label: 'C/S scar',
        type: 'text',
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.string(),
      },
      {
        name: 'conditionOfEpisiotomy',
        label: 'Condition of Episiotomy',
        type: 'text',
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.string(),
      },
    ],
    'Pelvic and Vaginal Health': [
      {
        name: 'pelvicExam',
        label: 'Pelvic exam',
        required: false,
        type: 'text',
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.string().required('Pelvic exam required'),
      },
      {
        name: 'lochia',
        label: 'Lochia (smell, amount, and color)',
        type: 'text',
        required: false,
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.string().required('Lochia required'),
      },
    ],
    'Bloodwork': [
      {
        name: 'haemoglobin',
        label: 'Haemoglobin',
        type: 'text',
        required: false,
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.number().required('Haemoglobin required'),
      },
    ],
    'HIV status': [
      {
        name: 'mothersHivStatus',
        label: "Mother's HIV status",
        type: 'radio',
        required: true,
        options: [
          { value: 'Not tested', label: 'Not tested' },
          { value: 'Negative', label: 'Negative' },
          { value: 'Reactive', label: 'Reactive' },
        ],
        width: { xs: 12, sm: 12, md: 12, lg: 10 },
        validate: yup.string().required('HIV status is required'),
      },
      {
        name: 'motherOnHaart',
        label: 'Mother on HAART',
        type: 'select',
        options: [
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' },
          { value: 'N/A', label: 'N/A' },
        ],
        validate: yup.string(),
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        relevant: formValues => formValues.mothersHivStatus === 'Reactive',
      },
      {
        name: 'hivRetestingAtSixWeeksPostChildbirth',
        label: 'HIV retesting (6 weeks post childbirth)',
        type: 'select',
        options: [
            { value: 'Positive', label: 'Positive'},
            { value: 'Negative', label: 'Negative'},
        ],
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.string(),
        relevant: formValues => formValues.mothersHivStatus  === 'Tested Negative',
      },
    ],
    'Family Planning': [
      {
        name: 'counselingOnFamilyPlanning',
        label: 'Counseling on family planning',
        type: 'select',
        options: [
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' },
          { value: 'N/A', label: 'N/A' },
        ],
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.string().required('Counselling on family planning required'),
      },
      {
        name: 'familyPlanningMethod',
        label: 'Family planning method',
        type: 'text',
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.string().required('Family planning method required'),
      },
    ],
    'Mental Health': [
      {
        name: 'screenForMaternalMentalHealth',
        label: 'Screen for maternal mental health',
        type: 'text',
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.string().required('Screen for maternal mental health required'),
      },
    ],
  };
export default MotherPostNatalCare;