import * as yup from 'yup';

const AEFIReportForm = {
  'Adverse event details': [
    {
      name: 'dateOfReport',
      label: 'Date of Report',
      type: 'date',
      required: true,
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup.date().required('Date of report is required'),
    },
    {
      name: 'descriptionOfEvent',
      label: 'Describe Adverse Event',
      type: 'textarea',
      required: true,
      width: { xs: 12, sm: 12, md: 12, lg: 12 },
      validate: yup.string().required('Description is required'),
    },
  ],
  'Vaccine details': [
    {
      name: 'antigenVaccine',
      label: 'Antigen / Vaccine',
      type: 'text',
      required: true,
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup.string().required('Antigen/Vaccine is required'),
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
  ],
  'Manufacturing details':[
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

export default AEFIReportForm;