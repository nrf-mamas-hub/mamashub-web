import * as yup from 'yup';

const specialCare = {
  'Reason for Special Care': [
    {
      name: 'reasonsForSpecialCare',
      label: 'Reason for Special Care (Tick as appropriate)',
      type: 'checkbox',
      validate: yup.array().min(1, 'Please select at least one option'),
      options: [
        { value: 'Birth weight less than 2.5 kg', label: 'Birth weight less than 2.5 kg' },
        { value: 'Birth less than two years after last birth', label: 'Birth less than two years after last birth' },
        { value: 'Birth order fifth child or more', label: 'Birth order fifth child or more' },
        { value: 'Born of a teenage mother', label: 'Born of a teenage mother' },
        { value: 'Born of a mentally ill mother', label: 'Born of a mentally ill mother' },
        { value: 'Child with developmental delays', label: 'Child with developmental delays' },
        { value: 'Siblings with undernourishment', label: 'Siblings with undernourishment' },
        { value: 'Multiple births', label: 'Multiple births' },
        { value: 'Children with special needs', label: 'Children with special needs' },
        { value: 'Orphans and vulnerable children', label: 'Orphans and vulnerable children' },
        { value: 'Child has a disability', label: 'Child has a disability' },
        { value: 'HIV-exposed infant', label: 'HIV-exposed infant' },
        { value: 'History or signs of child abuse or neglect', label: 'History or signs of child abuse or neglect' },
        { value: 'Cleft lip or palate', label: 'Cleft lip or palate' },
        { value: 'Other', label: 'Other' },   
      ],
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
      },
    },
    {
      name: 'specifyOtherReasonForSpecialCare',
      label: 'If other, please specify',
      type: 'text',
      validate: yup.string(),
      relevant: (values) => values.reasonsForSpecialCare.includes('Other'),      
      width: {
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
      },
    },
  ],
};

export default specialCare;