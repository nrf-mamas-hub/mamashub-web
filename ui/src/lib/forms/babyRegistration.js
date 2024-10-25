import counties from '../../data/counties.json';
import * as yup from 'yup';

const formData = {
  'Facility Details': [
    {
      name: 'facilityName',
      label: 'Name of Facility',
      type: 'text',
      required: true,
      disabled: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'kmhflCode',
      label: 'KMHFL Code',
      disabled: true,
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
  ],
  'Baby Details': [
    {
      name: 'pncCode',
      label: 'PNC Code',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.string().required('PNC Code is required'),
    },
    {
      name: 'names',
      label: 'Name of Baby',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.string().required('Name of client is required'),
    },
    {
      name: 'dob',
      label: 'Date of Birth',
      type: 'date',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.date().required('Date of birth is required')
    },
  ],
  'Clinical Information': [
    {
      name: 'height',
      label: 'Height (cm)',
      type: 'text',
      required: false,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.number().required('Height is required'),
    },
    {
      name: 'weight',
      label: 'Weight (kg)',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.number().required('Weight is required'),
    }
  ],
};

export default formData;
