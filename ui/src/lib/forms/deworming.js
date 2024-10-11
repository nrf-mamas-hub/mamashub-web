import * as yup from 'yup';

const deworming = {
  Deworming: [
    {
      name: 'dewormingDeworming',
      label:
        'Was deworming (Mebendazole 500mgs) given once in the 2nd trimester?',
      type: 'radio',
      validate: yup.string().required('Deworming given is required'),
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
      name: 'dewormingDateDewormingWasGiven',
      label: 'If yes, date given',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.dewormingDeworming === 'Yes',
    },
  ],
};

export default deworming;
