import * as yup from 'yup';

const earlyEyeProblems = {
  'TETRACYCLINE EYE OINTMENT (TEO) GIVEN': [
    {
      name: 'teoGivenTeo',
      label: 'TEO (ONLY at Birth)',
      type: 'radio',
      validate: yup.string().required('Tetracycline Eye Ointment status is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
      },
      options: [
        { value: "Given", label: "Given" },
        { value: "Not Given", label: "Not Given" },
      ],
      visibleFor: [0],
    },
  ],


  'PUPIL': [
    {
      name: 'pupil',
      label: 'Pupil',
      type: 'radio',
      validate: yup.string().required('Please select pupil status'),
      options: [
        {value: 'Black', label: 'Black'},
        {value: 'White', label: 'White (If white refer to eye clinic)'},
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
      },
      visibleFor: [0, 1, 2, 3],
    },
  ],

  'SIGHT': [
    {
      name: 'sight',
      label: 'Sight',
      type: 'radio',
      validate: yup.string().required('Please select sight status'),
      options: [
        {value: 'Following objects', label: 'Following objects'},
        {value: 'Not following objects', label: 'Not following objects (Refer to eye clinic)'},
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
      },
      visibleFor: [1, 2, 3], 
    },
  ],

  'SQUINT': [
    {
      name: 'squint',
      label: 'Squint (Crossed eyes)',
      type: 'radio',
      validate: yup.string().required('Please select squint status'),
      options: [
        {value: 'Squint', label: 'Squint (Refer to eye clinic)'},
        {value: 'No Squint', label: 'No Squint'},
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
      },
      visibleFor: [0, 1, 2, 3],
    },
  ],

  'ANY OTHER PROBLEM': [
    {
      name: 'anyOtherEyeProblem',
      label: 'ANY Other Problem',
      type: 'radio',
      validate: yup.string().required('Please select if there are any other problems'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
      },
      options: [
        { value: 'Yes', label: 'Yes (Refer to eye clinic)' },
        { value: 'No', label: 'No' },
      ],
      visibleFor: [0, 1, 2, 3],
    },
  ]
};

export default earlyEyeProblems;