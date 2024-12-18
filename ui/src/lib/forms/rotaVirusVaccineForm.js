import * as yup from 'yup';

const RotaVirusVaccineForm = {
  '1st Dose at 6 weeks (1.5mls administered orally, slowly)': [
    {
      name: 'batchNumber',
      label: 'Batch Number',
      type: 'text',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },      
      validate: yup.string().required('Batch number is required'),
    },
    {
      name: 'lotNumber',
      label: 'Lot Number',
      type: 'text',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },
      validate: yup.string().required('Lot number is required'),
    },
    {
      name: 'manufacturer',
      label: 'Manufacturer',
      type: 'text',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },
    },
    {
      name: 'dateOfExpiry',
      label: 'Date of expiry',
      type: 'date',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },
      validate: yup.date().required('Date of expiry is required'),
    },
    { 
      name: 'dateGiven',
      label: 'Date Given',
      type: 'date',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },
      validate: yup.date().required('Date given is required'),      
    },
    {
      name: 'dateOfNextVisit',
      label: 'Date of next visit',
      type: 'date',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },
      validate: yup.date().required('Date of next visit is required'),
    },
  ],
  '2nd Dose at 10 weeks (1.5mls administered orally, slowly)': [
    {
      name: 'batchNumber',
      label: 'Batch Number',
      type: 'text',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },      
      validate: yup.string().required('Batch number is required'),
    },
    {
      name: 'lotNumber',
      label: 'Lot Number',
      type: 'text',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },
      validate: yup.string().required('Lot number is required'),
    },
    {
      name: 'manufacturer',
      label: 'Manufacturer',
      type: 'text',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },
    },
    {
      name: 'dateOfExpiry',
      label: 'Date of expiry',
      type: 'date',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },
      validate: yup.date().required('Date of expiry is required'),
    },
    { 
      name: 'dateGiven',
      label: 'Date Given',
      type: 'date',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },
      validate: yup.date().required('Date given is required'),      
    },
  ],
};

export default RotaVirusVaccineForm;