import * as yup from 'yup';

const specialCare = {
  "Reason for Special Care": [
    {
      name: 'reasonsForSpecialCare',
      label: 'Reason for Special Care (Tick as appropriate)',
      type: 'radio',
      options: [],
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
    },
    {
      name: 'birthWeightLessThanTwoAndHalfKg',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'birthWeightLessThanTwoAndHalfKg', label: 'Birth weight less than 2.5 kg' }],
    },
    {
      name: 'birthLessThanTwoYearsAfterLastBirth',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'birthLessThanTwoYearsAfterLastBirth', label: 'Birth less than two years after last birth' }],
    },
    {
      name: 'birthOrderFifthChildOrMore',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'birthOrderFifthChildOrMore', label: 'Birth order fifth child or more' }],
    },
    {
      name: 'bornOfATeenageMother',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'bornOfATeenageMother', label: 'Born of a teenage mother' }],
    },
    {
      name: 'bornOfAMentallyIllMother',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'bornOfAMentallyIllMother', label: 'Born of a mentally ill mother' }],
    },
    {
      name: 'childWithDevelopmentalDelays',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'childWithDevelopmentalDelays', label: 'Child with developmental delays' }],
    },
    {
      name: 'siblingsUndernourishment',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'siblingsUndernourishment', label: 'Siblings with undernourishment' }],
    },
    {
      name: 'multipleBirths',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'multipleBirths', label: 'Multiple births' }],
    },
    {
      name: 'childrenWithSpecialNeeds',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'childrenWithSpecialNeeds', label: 'Children with special needs' }],
    },
    {
      name: 'orphansAndVulnerableChildren',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'orphansAndVulnerableChildren', label: 'Orphans and vulnerable children' }],
    },
    {
      name: 'childHasDisability',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'childHasDisability', label: 'Child has a disability' }],
    },
    {
      name: 'hivExposedInfant',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'hivExposedInfant', label: 'HIV-exposed infant' }],
    },
    {
      name: 'historyOrSignsOfChildAbuseOrNeglect',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'historyOrSignsOfChildAbuseOrNeglect', label: 'History or signs of child abuse or neglect' }],
    },
    {
      name: 'cleftLipOrPalate',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'cleftLipOrPalate', label: 'Cleft lip or palate' }],
    },
    {
      name: 'otherReasonForSpecialCare',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'Other', label: 'Other' }],
    },
    {
      name: 'specifyOtherReasonForSpecialCare',  // Changed name to avoid conflict
      label: 'If other, please specify',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.otherReasonForSpecialCare?.includes('Other'),
    }
     
  ],
};

export default specialCare;



