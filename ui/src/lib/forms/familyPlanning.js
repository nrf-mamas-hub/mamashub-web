import * as yup from 'yup';

const formData = {
    'Family Planning': [
      {
        name: 'familyPlanningDate',
        label: 'Date',
        type: 'date',
        required: true,
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 6,
        },
        validate: yup.date().required('Date is required'),
      },
      {
        name: 'familyPlanningMethod',
        label: 'Family planning method',
        type: 'text',
        required: true,
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,
          },
          validate: yup.string().required('Family planning method is required'),
      },
      {
        name: 'familyPlanningWeight',
        label: 'Weight',
        type: 'text',
        required: true,
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,
          },
          validate: yup.string().required('Weight is required'),
      },
      {
        name: 'familyPlanningBloodPressure',
        label: 'Blood pressure',
        type: 'text',
        required: true,
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,
          },
          validate: yup.string().required('Blood pressure is required'),
      },
      {
        name: 'familyPlanningRemarks',
        label: 'Remarks',
        type: 'textarea',
        required: true,
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,
          },
          validate: yup.string().required('Remarks are required'),
      }
    ]
}

export default formData;
