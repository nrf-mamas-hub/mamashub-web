import * as yup from 'yup';

const yellowFeverVaccineFields = {
  
 'Dose:(0.5ml) Intra Mascular Left Upper Deltoid': [
    
    {
      name: 'dateOfVaccineGiven',
      label: 'Date Given',
      type: 'date',
      validate: yup
        .date()
        .max(new Date(), 'Date of vaccine cannot be in the future')
        .required('Date vaccine is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },

    {
      name: 'batchNumber',
      label: 'Batch Number',
      type: 'text',
      validate: yup.number().required('Batch Number is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 3,
      },
    },

    {
      name: 'lotNumber',
      label: 'Lot Number',
      type: 'text',
      validate: yup.number().required('Lot Number is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 3,
      },
    },

    {
      name: 'manufacturer',
      label: 'Manufacturer',
      type: 'text',
      validate: yup.string().required('Manufacturer is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 3,
      },
    },

    {
      name: 'dateOfVaccineExpiry',
      label: 'Date of drug expiry',
      type: 'date',
      validate: yup
        .date()
        .min(new Date(), 'Date of drug expiration date cannot be in the past')
        .required('Date of expiration is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },
  ],

 
};

export default yellowFeverVaccineFields;