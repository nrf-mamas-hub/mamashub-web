import * as yup from 'yup';

const BabTeethDevelopment = {
  "Baby's Teeth Development": [ 
    {
      name: 'teethObservation',
      label: 'Observation',
      type: 'select',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        { value: 'Lower incisor', label: 'Lower Incisor (4-10 Months)' },
        { value: 'Upper incisor', label: 'Upper Incisor (6-12 months)' },
        { value: 'Lower canine', label: 'Lower Canine (12-23 months)' },
        { value: 'Upper canine', label: 'Upper Canine (12-23 months)' },
        { value: 'Lower first molar', label: 'Lower First Molar (12-18 months)' },
        { value: 'Upper first molar', label: 'Upper First Molar (12-18 months)'},
        { value: 'Lower second molar', label: 'Lower Second Molar (24-30 months)' },
        { value: 'Upper second molar', label: 'Upper second Molar (24-30 months)' },
      ],    
      validate: yup.string().required('Teeth observation is required'),      
    },
    {
      name: 'ageOfBabyWhenToothSeen',
      label: 'Age of baby when tooth seen',
      type: 'text',
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