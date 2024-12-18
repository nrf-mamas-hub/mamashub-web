import * as yup from 'yup';

const RotaVirusVaccineForm = {
  '1st Dose at 6 weeks (1.5mls administered orally, slowly)': [
    {
      name: 'dateGiven',
      label: 'Date Given',
      type: 'date',
      required: true,
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup.date()
    .min(new Date(new Date().setHours(0, 0, 0, 0)), 'Date must be today')
    .max(new Date(new Date().setHours(23, 59, 59, 999)), 'Date must be today')
    .required('Date given is required'),
    },
    {
      name: 'nextVisitDate',
      label: 'Date of Next Visit',
      type: 'date',
      required: true,
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup.date()
      .min(new Date(new Date().setDate(new Date().getDate() + 1)), 'Date cannot be today or in the past')
      .required('Date of next visit is required'),
    },
    {
      name: 'batchNumber',
      label: 'Batch Number',
      type: 'text',
      required: true,
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup.string().required('Batch number is required'),
    },
    {
      name: 'lotNumber',
      label: 'Lot Number',
      type: 'text',
      required: true,
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup.string().required('Lot number is required'),
    },
    {
      name: 'manufactureDate',
      label: 'Manufacture Date',
      type: 'date',
      required: true,
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup.date().required('Manufacture date is required'),
    },
    {
      name: 'expiryDate',
      label: 'Expiry Date',
      type: 'date',
      required: true,
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup.date().required('Expiry date is required'),
    },
    {
      name: 'manufacturerName',
      label: "Manufacturer's Name",
      type: 'text',
      required: true,
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup.string().required("Manufacturer's name is required"),
    },
  ],
  '2nd Dose at 10 weeks (1.5mls administered orally, slowly)': [
    {
      name: 'dateGiven',
      label: 'Date Given',
      type: 'date',
      required: true,
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup.date()
    .min(new Date(new Date().setHours(0, 0, 0, 0)), 'Date must be today')
    .max(new Date(new Date().setHours(23, 59, 59, 999)), 'Date must be today')
    .required('Date given is required'),
    },
    {
      name: 'batchNumber',
      label: 'Batch Number',
      type: 'text',
      required: true,
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup.string().required('Batch number is required'),
    },
    {
      name: 'lotNumber',
      label: 'Lot Number',
      type: 'text',
      required: true,
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup.string().required('Lot number is required'),
    },
    {
      name: 'manufactureDate',
      label: 'Manufacture Date',
      type: 'date',
      required: true,
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup.date().required('Manufacture date is required'),
    },
    {
      name: 'expiryDate',
      label: 'Expiry Date',
      type: 'date',
      required: true,
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup.date().required('Expiry date is required'),
    },
    {
      name: 'manufacturerName',
      label: "Manufacturer's Name",
      type: 'text',
      required: true,
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup.string().required("Manufacturer's name is required"),
    },
  ],
};

export default RotaVirusVaccineForm;