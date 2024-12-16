import * as yup from 'yup';

const AEFIFields = {
  "Event details":[
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },
      validate: yup.date().required('Date is required'),
    },
    {
      name: 'intoleranceDescription',
      label: 'Describe',
      type: 'textarea',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },
      validate: yup.string().required('Description is required'),
    },
    {
      name: 'antigenOrVaccine',
      label: 'Antigen / Vaccine',
      type: 'select',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },
      options: [
        { value: "BCG Vaccine", label: "BCG Vaccine" },
        { value: "Polio Vaccine", label: "Polio Vaccine" },
        { value: "Inactivated Polio Vaccine", label: "IPV (Inactivated Polio Vaccine)" },
        { value: "Diphtheria and Pertussis etc Vaccine", label: "Diphtheria/Pertussis Vaccine" },
        { value: "Pneumococcal Conjugate Vaccine", label: "Pneumococcal Conjugate Vaccine" },
        { value: "Rota Virus Vaccine", label: "Rota Virus Vaccine" },
        { value: "Measles Rubella Vaccine", label: "Measles Rubella Vaccine" },
        { value: "Yellow Fever Vaccine", label: "Yellow Fever Vaccine" }        
      ],
      validate: yup.string().required('Antigen/Vaccine is required'),
    },
    {
      name: 'batchNo',
      label: 'Batch Number',
      type: 'text',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },
      validate: yup.string().required('Batch number is required'),
    },
    {
      name: 'manufactureDate',
      label: 'Manufacture Date',
      type: 'date',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },
      validate: yup.date().required('Manufacture date is required'),
    },
    {
      name: 'expiryDate',
      label: 'Expiry Date',
      type: 'date',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },
      validate: yup.date().required('Expiry date is required'),
    },
    {
      name: 'manufacturer',
      label: "Manufacturer's Name",
      type: 'text',
      required: true,
      width: { xs: 12, sm: 12, md: 8, lg: 6 },
      validate: yup.string().required("Manufacturer's name is required"),
    },
  ]
};

export default AEFIFields;