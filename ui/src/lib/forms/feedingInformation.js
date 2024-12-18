import * as yup from 'yup';

const feedingInfoFields = {
  'Feeding Information': [
    {
      name: 'breastFeeding',
      label: 'Breastfeeding:',
      type: 'radio',
      validate: yup.string().required('Breastfeeding status is required'),
      width: {
        xs: 12,
        sm: 14,
        md: 8,
        lg: 24,
      },
      options: [{ label: 'Well', value: 'Well' }, { label: 'Poorly', value: 'Poorly' }, { label: 'Unable to breastfeed', value: 'Unable to breastfeed'}],
    },
    
    {
      name: 'otherFeedsBelowSixMonths',
      label: 'Other feeds introduced below 6 months:',
      type: 'text',
      type: 'radio',
      validate: yup.string().required('This field is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 24,
        relevant: (formValues) => formValues.otherFeedsBelowSixMonthsYes === 'Yes',
      },
      options: [{ label: 'Yes', value: 'Yes' }, {label: 'No', value:'No'}],
      
    },
   
    {
      name: 'otherFeedsBelowSixMonthsYesAge',
      label: 'If yes, at what age',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
        options: [{ label: 'Yes', value: 'Yes' }, {label: 'No', value:'No'}]
      },
      relevant: (formValues) => formValues.otherFeedsBelowSixMonths === 'Yes',
    },
    {
      name: 'complementaryFoodFromSixMonths',
      label: 'Complementary food from 6 months:Other foods introduced:',
      type: 'text',
      type: 'radio',
      validate: yup.string().required('This field is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 24,
        
      },
      options: [{ label: 'Yes', value: 'Yes' }, {label: 'No', value:'No'}],
      
    },
    {
      name: 'retentionOfFeedsOrindigestion',
      label: 'Retention of feeds/indigestion',
      type: 'textarea',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
   
  ],
};

export default feedingInfoFields;
