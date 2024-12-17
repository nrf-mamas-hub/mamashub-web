import * as yup from 'yup';
import babyPostNatalData from '../../data/baby_postnatal_care.json';

const babyPostNatalCareFields = {
  
 'Visit details': [
    {
      name: 'generalTimingOfVisit',
      label: 'Timing of visit',
      type: 'select',
      validate: yup.string().required('Timing of visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      options: Object.keys(babyPostNatalData).map(key => ({
        value: key,
        label: key,
      })),
    },
    {
      name: 'nextVisit',
      label: 'Date/Visit',
      type: 'date',
      validate: yup
        .date()
        .max(new Date(), 'Date of visit cannot be in the future')
        .required('Date of visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
    },
  ],

  'General Condition':
  [
    {
      name: 'generalCondition',
      label: 'General condition',
      type: 'radio',
      validate: yup.string().required('General condition is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      options: [
        { label: 'Well', value: 'Well' },
        { label: 'Unwell', value: 'Unwell' },
      ],
    },
    {
      name: 'generalConditionSpecify',
      label: 'If unwell, please specify',
      type: 'textarea',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      relevant: values => values.generalCondition === 'Unwell',
    }
    ],  
   'Vitals':[
    {
      name: 'babyTemperature',
      label: 'Temperature',
      type: 'text',
      validate: yup.number().required('Temperature is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
    },
    {
      name: 'breathsPerMinute',
      label: 'Breaths Per Minute',
      type: 'text',
      validate: yup.number().required('Breaths Per Minute is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
    },
  ],
  
  'Feeding Method': [
    
    {
      name: 'exclusiveBreastfeeding',
      label: 'Exclusive Breastfeeding',
      type: 'radio',
      validate: yup.string().required('Exclusive breastfeeding is required'),
      options: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    }
  ],
  'Breastfeeding':[
    {
      name: 'breastfeedingPositioning',
      label: 'Positioning:',
      type: 'radio',
      validate: yup.string().required('Positioning is required'),
      options: [
        { value: 'Correct', label: 'Correct' },
        { value: 'Not Correct', label: 'Not Correct' },
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
    },
    {
      name: 'breastfeedingAttachment',
      label: 'Attachment:',
      type: 'radio',
      validate: yup.string().required('Attachment is required'),
      options: [
        { value: 'Good', label: 'Good' },
        { value: 'Poor', label: 'Poor' },
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
    },
  ],

  'Umblical Cord': [

    {
      name: 'umblicalCordStatus',
      label: 'Status',
      type: 'radio',
      validate: yup.string().required('Umbilical cord status is required'),
      options: [
        { value: 'Clean', label: 'Clean' },
        { value: 'Dry', label: 'Dry' },
        { value: 'Bleeding', label: 'Bleeding' },
        { value: 'Infected', label: 'Infected' },
        { value: 'Others', label: 'Others' },
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
    },
    {
      name: 'othersSpecify',
      label: 'If others, please specify',
      type: 'textarea',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      relevant: values => values.umblicalCordStatus === 'Others',
    }
  ],
  'Irritability':[
    {
      name: 'irritable',
      label: 'Irritable',      
      type: 'radio',
      validate: yup.string().required('Irritability is required'),
      options: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
    },
  ],

  'Other Problems ':
  [
    {
      name: 'anyOtherProblem',
      label: 'Any Other Problem?',
      type: 'textarea',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
    }
    ],    
  'Immunization': [
  
    {
      name: 'babyImmunizationStarted',
      label: 'Immunization Started',
      type: 'radio',
      validate: yup.string().required('Immunization is required'),
      options: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    }
  ],
  'ART Prophylaxis':[
    {
      name: 'heiGivenArtProphylaxis',
      label: 'HEI given ART prophylaxis',
      type: 'radio',
      validate: yup.string().required('ART prophylaxis is required'),
      options: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 20,
      },
    }
  ],
  'Cotrimoxazole Prophylaxis':[
    {
      name: 'babyCotrimoxazoleProphylaxisInitiated',
      label: 'Baby cotrimoxazole prophylaxis initiated',
      type: 'radio',
      validate: yup.string().required('Cotrimoxazole prophylaxis is required'),
      options: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
        { value: 'N/A', label: 'N/A' },
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 20,
      },
    },
    
  ],
};

export default babyPostNatalCareFields;