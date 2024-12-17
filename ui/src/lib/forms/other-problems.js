import * as yup from 'yup';

const otherproblems = {
  "Other problems as reported by parent/guardian": [
    {
      name: 'babySleepingProblem',
      label:
        'Does the baby have  sleeping problems?',
      type: 'radio',
      validate: yup.string().required('Baby sleeping problems is required'),
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
        name: 'babyIrritability',
        label:
          'Irritability?',
        type: 'radio',
        validate: yup.string().required('Irritability  is required'),
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

      {name: 'babyOtherProblems',
        label:
          'Others, specify',
        type: 'textarea',
        validate: yup.string(),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 6,
        },
        
        
      }
  ],
};

export default otherproblems;
