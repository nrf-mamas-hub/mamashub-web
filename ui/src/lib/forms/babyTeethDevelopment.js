import * as yup from 'yup';

const BabTeethDevelopment = {
  "Baby's Teeth Development": [ 
    {
      name: 'toothObservation',
      label: 'Observation',
      type: 'select',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 8,
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
      validate: yup.string().required('Tooth observation is required'),      
    },
    {
      name: 'ageOfBabyWhenToothSeen',
      label: 'Age of baby when tooth seen',
      type: 'text',
     validate: yup.number().required("Age is required"), 
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      relevant: (formValues) => formValues.toothObservation,
    },
    {
      name: 'dateToothSeen',
      label: 'Date seen',
      type: 'date',
      validate: yup.date().required("Date is required"),
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
      relevant: (formValues) => formValues.toothObservation,
    }, 
  ],
};
export default BabTeethDevelopment;