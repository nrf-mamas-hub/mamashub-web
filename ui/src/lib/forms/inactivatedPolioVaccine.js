import * as yup from 'yup'; 


const inactivatedPolioVaccineFormFields = {
  //new version
  'IPV (0.5mls) Dose at 14 weeks Intramuscular into the outer aspect of the right thigh 2.5cm (2 fingers apart) from the site of PCV10 injection':
   [
    {
      name: 'dateGiven',
      label: 'Date Given (DD/MM/YY)',
      type: 'date',
      validate: yup.date().required("The date first seen is required"),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
        name: 'dateOfNextVisit',
        label: 'Date Of Next Visit (DD/MM/YY)',
        type: 'date',
        validate: yup.date().required("The date first seen is required"),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 6,
        },
      },
      {
        name: 'batchNumber',
        label: 'Batch Number',
        type: 'text',
        validate: yup.string().required("Batch Number is required"),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 6,
        },
      },
      {
        name: 'lotNumber',
        label: 'Lot Number',
        type: 'text',
        validate: yup.string().required("Lot Number is required"),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 6,
        },
      },
      {
        name: 'manufactuer',
        label: 'Manufacturer',
        type: 'text',
        validate: yup.string().required("Manufacturer is required"),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 6,
        },
      },
      {
        name: 'expiryDate',
        label: 'Date of Expiry (DD/MM/YY)',
        type: 'date',
        validate: yup.date().required("The Expiry Date is required"),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 6,
        },
      },
  ],

};

// Export the forms as named exports
export default inactivatedPolioVaccineFormFields;
