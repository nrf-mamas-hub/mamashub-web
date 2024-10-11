import * as yup from 'yup';
import malariaContacts from '../../data/malariaProphylaxisContacts.json';

const malariaProphylaxis = {
  'ANC Visit': [
    {
      name: 'malariaProphylaxisTimingOfContact',
      label: 'Timing of contact',
      type: 'select',
      validate: yup.string().required('Timing of contact is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: Object.keys(malariaContacts).map(key => ({
        value: key,
        label: key,
      })),
    },
    {
      name: 'malariaProphylaxisDose',
      label: 'Dose given',
      type: 'radio',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ],
      relevant: formValues =>
        !formValues.timingOfContact?.includes('12') &&
        !formValues.timingOfContact?.includes('40'),
    },
    {
      name: 'malariaProphylaxisYesResult',
      label: 'If yes, date given',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.doseGiven === 'Yes',
    },
    {
      name: 'malariaProphylaxisNoResult',
      label: 'If no, next visit',
      type: 'date',
      validate: yup
        .date()
        .min(new Date(), 'Next visit date cannot be in the past'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.doseGiven === 'No',
    },
    {
      name: 'malariaProphylaxisNextVisit',
      label: 'Next visit',
      type: 'date',
      validate: yup
        .date()
        .min(new Date(), 'Next visit date cannot be in the past')
        .required('Next visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
  ],
  'Long Lasting Insecticide Treated Nets (LLITN)': [
    {
      name: 'malariaProphylaxisLLITNGiven',
      label: 'Was LLITN given to the mother?',
      type: 'radio',
      validate: yup.string().required('LLITN given is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ],
    },
    {
      name: 'malariaProphylaxisLLITNYesResult',
      label: 'If yes, date given',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.llitnGiven === 'Yes',
    },
  ],
};

export default malariaProphylaxis;
