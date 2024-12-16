import * as yup from 'yup';
import childpostnataldata from '../../data/child_postnatal_care.json';

const childPostnatalCareFields = {
  
 '': [
    {
      
      name: 'generalTimingOfVisit',
      label: 'Timing of visit',
      type: 'select',
      validate: yup.string().required('Timing of visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
      options: Object.keys(childpostnataldata).map(key => ({
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
        .required('Date visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },
  ],

  'General Condition':
  [
    {
      name: 'generalCondition',
      label: 'General Condition',
      type: 'radio',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
      },
      options: [
        { label: 'Well', value: 'Well' },
        { label: 'Unwell', value: 'Unwell' },
      ],
    },
    {
      name: 'generalConditionSpecify',
      label: 'If Unwell, please specify',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      relevant: values => values.generalCondition === 'Unwell',
    },
    {
      name: 'babyTemperature',
      label: 'Temperature',
      type: 'text',
      validate: yup.number().required('Temperature is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 3,
      },
    },
    {
      name: 'breathsPerMinute',
      label: 'Breaths Per Minute',
      type: 'text',
      validate: yup.number().required('Breath Per Minute is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 3,
      },
    },
    
    
  ],
  
  'Feeding Method': [
    
    {
      name: 'exclusiveBreastfeeding',
      label: 'Exclusive Breastfeeding',
      type: 'radio',
      validate: yup.string().required('This field is required'),
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
    },
    {
      name: 'exclusiveBreastfeedingSpecify',
      label: 'If No, please explain',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      relevant: values => values.exclusiveBreastfeeding === 'No',
    },
    {
      name: 'breastfeedingPositioning',
      label: 'Breastfeeding Positioning',
      type: 'radio',
      validate: yup.string().required('This field is required'),
      options: [
        { value: 'Correct', label: 'Correct' },
        { value: 'Not Correct', label: 'Not Correct' },
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 20,
      },
    },
    {
      name: 'breastfeedingBestPositioning',
      label: 'If not correct, suggest the best way',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      relevant: values => values.breastfeedingPositioning === 'Not Correct',
    },
    {
      name: 'breastfeedingAttachment',
      label: 'Breastfeeding Attachment',
      type: 'radio',
      validate: yup.string().required('This field is required'),
      options: [
        { value: 'Good', label: 'Good' },
        { value: 'Poor', label: 'Poor' },
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 20,
      },
    },
  ],

  'Umblical Cord': [

    {
      name: 'umblicalCordStatus',
      label: 'Umblical Cord Status',
      type: 'radio',
      validate: yup.string().required(),
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
        md: 12,
        lg: 20,
      },
    },
    {
      name: 'othersSpecify',
      label: 'If others, please specify',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      relevant: values => values.umblicalCordStatus === 'Others',
    },

    {
      name: 'irritable',
      label: 'Irritable',
      type: 'radio',
      validate: yup.string().required(),
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
    },
  ],

  'Any other ':
  [
    {
      name: 'anyOtherProblem',
      label: 'Any Other Problem?',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 20,
        sm: 20,
        md: 20,
        lg: 20,
      },
    },


    {
      name: 'babyImmunizationStarted',
      label: 'Immunization Started',
      type: 'radio',
      validate: yup.string().required(),
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
    },

    //{
    //  name: 'heiGivenArtProphylaxis',
    //  label: 'HEI given ART prophylaxis:',
    //  type: 'radio',
    //  validate: yup.string().required(),
    //  options: [
    //    { value: 'Yes', label: 'Yes' },
    //    { value: 'No', label: 'No' },
    //  ],
    //  width: {
    //    xs: 12,
    //    sm: 12,
    //    md: 12,
    //    lg: 20,
    //  },
    //},
    //{
    //  name: 'heiNotGivenArtProphylaxis',
    //  label: 'If No start on ART PROPHYLAXIS, see page 36 on booklet',
    //  type: 'text',
    //  validate: yup.string(),
    //  width: {
    //    xs: 12,
    //    sm: 12,
    //    md: 8,
    //    lg: 6,
    //  },
    //  relevant: values => values.heiGivenArtProphylaxis === 'No',
    //},

    {
      name: 'babyCotrimoxazoleProphylaxisInitiated',
      label: 'Baby cotrimoxazole prophylaxis initiated:',
      type: 'radio',
      validate: yup.string().required(),
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

export default childPostnatalCareFields;