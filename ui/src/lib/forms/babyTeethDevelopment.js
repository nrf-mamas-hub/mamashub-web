import * as yup from 'yup';

const BabTeethDevelopment = {
  "Baby Teeth Development": [ 
    {
      name: 'BabyTeethDevelopment',
      label: 'Select Teeth Type',
      type: 'select',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        { value: 'LowerIncisor', label: 'Lower Incisor present?  (4-10 Months)' },
        { value: 'upperIncisor', label: 'Upper Incisor Present? (6-12 months)' },
        { value: 'lowerCanine', label: 'Lower Canine Present? (12-23 months)?' },
        { value: 'upperCanine', label: 'Upper Canine present?(12-23 months)' },
        { value: 'lowerFirstMolar', label: 'Lower First Molar Present?(12-18 months)' },
        { value: 'upperFirstMolar', label: 'Upper First Molar?(12-18 months)' },
        { value: 'lowerSecondMolar', label: 'Lower Second Molar(24-30 months)?' },
        { value: 'upperSecondMolar', label: 'Upper second Molar present? (24-30 months)?' },
      ],
    
      validate: yup.string().required('Relationship is required'),
      
    },
    {
      name: 'lowerIncisorFourToTenMonthsAgeOfBabyWhenToothSeen',
      label: 'Age of baby when tooth seen (in months)',
      type: 'text',
     //yup
     validate: yup.number(), 
      width: {
        xs: 5,
        sm: 5,
        md: 5,
        lg: 4,
      },
      relevant: (formValues) =>formValues.BabyTeethDevelopment === 'LowerIncisor' &&
      !(formValues.lowerIncisorFourToTenMonthsDateSeen && formValues.lowerIncisorFourToTenMonthsAgeOfBabyWhenToothSeen),
    },
    {
      name: 'lowerIncisorFourToTenDateSeen',
      label: 'If present, date seen',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 4,
        sm: 4,
        md: 4,
        lg: 3,
      },
      relevant: (formValues) => 
        formValues.BabyTeethDevelopment === 'LowerIncisor' &&
        !(formValues.lowerIncisorFourToTenMonthsDateSeen && formValues.lowerIncisorFourToTenMonthsAgeOfBabyWhenToothSeen),
    
    }, 
    //upper incisor 
    {
      name: 'upperIncisorSixToTwelveMonthsAgeOfBabyWhenToothSeen',
      label: 'Age of baby when tooth seen (in months)',
      type: 'text',
      validate: yup
        .number(),
       
      width: {
        xs: 5,
        sm: 5,
        md: 5,
        lg: 4,
      },
      relevant: (formValues) => formValues.BabyTeethDevelopment === 'upperIncisor' && !formValues.upperIncisorSixToTwelveMonthsDateSeen,
      
    },
    
    {
      name: 'upperIncisorSixToTwelveMonthsDateSeen',
      label: 'If Present, date seen',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 4,
        sm: 4,
        md: 4,
        lg: 3,
      },
      relevant: formValues => formValues.BabyTeethDevelopment === 'upperIncisor',
        // formValues.upperIncisor === 'Yes',
    
},
    //lower canine
    {
      name: 'lowerCanineTwelveToTwentyThreeMonthsAgeOfBabyWhenToothSeen',
      label: 'Age of baby when tooth seen (in months)',
      type: 'text',
      validate: yup
        .number(),
      width: {
        xs: 5,
        sm: 5,
        md: 5,
        lg: 4,
      },
      relevant: formValues =>formValues.BabyTeethDevelopment === 'lowerCanine',
      
    },

    {
      name: 'lowerCanineTwelveToTwentyThreeMonthsDateSeen',
      label: 'If yes, date seen',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 4,
        sm: 4,
        md: 4,
        lg: 3,
      },
      relevant: formValues => formValues.BabyTeethDevelopment === 'lowerCanine',
    },
    //upper canine
    {
      name: 'upperCanineTwelveToTwentyThreeMonthsAgeOfBabyWhenToothSeen',
      label: 'Age of baby when tooth seen (in months)',
      type: 'text',
      validate: yup
        .number(),
        
      width: {
        xs: 5,
        sm: 5,
        md: 5,
        lg: 4,
        },
      relevant: formValues => formValues.BabyTeethDevelopment === 'upperCanine',
      
    },

    {
      name: 'upperCanineTwelveToTwentyThreeMonthsDateSeen',
      label: 'If yes, date Seen',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 4,
        sm: 4,
        md: 4,
        lg: 3,
      },
      relevant: formValues => formValues.BabyTeethDevelopment === 'upperCanine',
    },
  
    //lower first molar
    {
      name: 'lowerFirstMolarTwelveToEighteenMonthsAgeOfBabyWhenToothSeen',
      label: 'Age of baby when tooth seen (in months)',
      type: 'text',
      validate: yup
        .number(),
        
      width: {
        xs: 5,
        sm: 5,
        md: 5,
        lg: 4,
      },
      relevant: formValues => formValues.BabyTeethDevelopment === 'lowerFirstMolar',
      
    },

    {
      name: 'lowerFirstMolarTwelveToEighteenMonthsDateSeen',
      label: 'If yes, date seen',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 4,
        sm: 4,
        md: 4,
        lg: 3,
      },
      relevant: formValues => formValues.BabyTeethDevelopment === 'lowerFirstMolar',
    },
    //upper first molar
    {
      name: 'upperFirstMolarTwelveToEighteenMonthsAgeOfBabyWhenToothSeen',
      label: 'Age of baby when tooth seen (in months)',
      type: 'text',
      validate: yup
        .number(),
      
      width: {
        xs: 5,
        sm: 5,
        md: 5,
        lg: 4,
      },
      relevant: formValues =>  formValues.BabyTeethDevelopment === 'upperFirstMolar',
      
    },

    {
      name: 'upperFirstMolarTwelveToEighteenMonthsDateSeen',
      label: 'If yes, date seen',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 4,
        sm: 4,
        md: 4,
        lg: 3,
      },
      relevant: formValues =>formValues.BabyTeethDevelopment === 'upperFirstMolar',
    },
    //lower second molar
    {
      name: 'lowerSecondMolarTwentyFourToThirtyMonthsAgeOfBabyWhenToothSeen',
      label: 'Age of baby when tooth seen (in months)',
      type: 'text',
      validate: yup
        .number(),
       
      width: {
        xs: 5,
        sm: 5,
        md: 5,
        lg: 4,
      },
      relevant: formValues => formValues.BabyTeethDevelopment === 'lowerSecondMolar',
      
    },

    {
      name: 'lowerSecondMolarTwentyFourToThirtyMonthsDateSeen',
      label: 'If yes, date seen',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 4,
        sm: 4,
        md: 4,
        lg: 3,
      },
      relevant: formValues => formValues.BabyTeethDevelopment === 'lowerSecondMolar',
    },
    //upper second molar
    {
      name: 'upperSecondMolarTwentyFourToThirtyMonthsAgeOfBabyWhenToothSeen',
      label: "baby's Age when tooth seen (in months)",
      type: 'text',
      validate: yup
        .number(),
       
      width: {
        xs: 5,
        sm: 5,
        md: 5,
        lg: 4,
      },
      relevant: formValues => formValues.BabyTeethDevelopment === 'upperSecondMolar',
      
    },

  
    {
      name: 'upperSecondMolarTwentyFourToThirtyMonthsDateSeen',
      label: 'If yes, date Seen',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 4,
        sm: 4,
        md: 4,
        lg: 3,
      },
      relevant: formValues => formValues.BabyTeethDevelopment === 'upperSecondMolar',
    },
    
    
    
  ],
};
export default BabTeethDevelopment;