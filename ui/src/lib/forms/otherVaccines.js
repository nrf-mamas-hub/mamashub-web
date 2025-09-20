import * as yup from 'yup';

const vaccineOptions = [
  { label: 'Hepatitis B Vaccine', value: 'Hepatitis B Vaccine' },
  { label: 'HPV Vaccine', value: 'HPV Vaccine' },
  { label: 'Typhoid Conjugate Vaccine (TCV)', value: 'TCV' },
  { label: 'Malaria Vaccine', value: 'Malaria Vaccine' },
  { label: 'Respiratory Syncytial Virus (RSV)', value: 'RSV' },
];

const otherVaccinesFields = {
  'Other Vaccines': [
    {
      label: 'Vaccine Name',
      type: 'select',
      options: vaccineOptions,
      validate: yup
        .string()
        .oneOf(vaccineOptions.map(v => v.value))
        .required('Vaccine name is required'),
      name: 'otherVaccinesName',
      placeholder: 'Select a vaccine',
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
    },
    {
      label: 'Date Given',
      type: 'date',
      validate: yup.date().required('Date is required'),
      name: 'immunizationDateGiven',
      width: { xs: 12, sm: 12, md: 6, lg: 3 },
    },
    {
      label: 'Site',
      type: 'select',
      options: [
        { label: 'Right Thigh (infants)', value: 'rightThigh' },
        { label: 'Left Thigh (infants, if multiple vaccines)', value: 'leftThigh' },
        { label: 'Deltoid (upper arm)', value: 'leftUpperDeltoid' },
      ],
      validate: yup.string().required('Site is required'),
      name: 'otherVaccinesSite',
      placeholder: 'Select injection site',
      width: { xs: 12, sm: 12, md: 6, lg: 3 },
    },
  ],
};

export default otherVaccinesFields;
