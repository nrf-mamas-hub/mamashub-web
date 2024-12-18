import * as yup from 'yup';

const MicronutientPowders = {
    'Visit details': [
      {
        name: 'ageInMonths',
        label: 'Age in Months',
        type: 'select',
        required: true,
        options: [
          { value: '6th Month', label: '6th Month' },
          { value: '7th Month', label: '7th Month' },
          { value: '8th Month', label: '8th Month' },
          { value: '9th Month', label: '9th Month' },
          { value: '10th Month', label: '10th Month' },
          { value: '11th Month', label: '11th Month' },
          { value: '12th Month', label: '12th Month' },
          { value: '13th Month', label: '13th Month' },
          { value: '14th Month', label: '14th Month' },
          { value: '15th Month', label: '15th Month' },
          { value: '16th Month', label: '16th Month' },
          { value: '17th Month', label: '17th Month' },
          { value: '18th Month', label: '18th Month' },
          { value: '19th Month', label: '19th Month' },
          { value: '20th Month', label: '20th Month' },
          { value: '21st Month', label: '21st Month' },
          { value: '22nd Month', label: '22nd Month' },
          { value: '23rd Month', label: '23rd Month' },
        ],
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.string().required('Age in Months is required'),
      },
    ],
    'Number of Micronutrient Powder Sachets Issued': [
      {
        name: 'numberMicronutrientPowderSachetsIssued',
        label: 'Number of Micronutrient Powder Sachets Issued',
        type: 'text',
        required: true,
        width: { xs: 12, sm: 12, md: 10, lg: 4 },
        validate: yup.number().required('Number of micronutrient powder sachets is required'),
      },
    ],
    'Date Issued': [
      {
        name: 'dateIssued',
        label: 'Date Issued',
        type: 'date',
        required: true,
        width: { xs: 12, sm: 12, md: 10, lg: 4 },
        validate: yup.date().required('Date ofissued is required'),
      },
    ],
    'Date of the Next Visit': [
      {
        name: 'dateOfTheNextVisit',
        label: 'Date of The Next Visit',
        type: 'date',
        required: true,
        width: { xs: 12, sm: 12, md: 12, lg: 4 },
        validate: yup.date().required('Date of the next visit is required'),
      },
    ],
  };
export default MicronutientPowders;    
    
