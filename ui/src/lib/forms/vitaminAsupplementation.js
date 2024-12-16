import * as yup from 'yup';

const vitaminAsupplementationFields = {

  'Dose(100,000 IU):at 6 months': [
    {
        name: 'ageGiven1',
        label: 'Age Given',
        type: 'text',
        validate: yup.number().required('Age given is required'),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 3,
        },
      },
    {
      name: 'vasDateGiven1',
      label: 'Date of vitamin A supplement given',
      type: 'date',
      validate: yup
        .date()
        .max(new Date(), 'Date of vaccine cannot be in the future')
        .required('Date vaccine is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },

    {
      name: 'vasDateNextVisit1',
      label: 'Date of next visit',
      type: 'date',
      validate: yup
        .date()
        .min(new Date(), 'Date of visit cannot be in the past')
        .required('Date visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },
     
  ],

  'Dose(200,000 IU):at 12 months (1 year)': [
    {
        name: 'ageGiven2',
        label: 'Age Given',
        type: 'text',
        validate: yup.number().required('Age given is required'),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 3,
        },
      },
    {
      name: 'vasDateGiven2',
      label: 'Date of vitamin A supplement given',
      type: 'date',
      validate: yup
        .date()
        .max(new Date(), 'Date of vaccine cannot be in the future')
        .required('Date vaccine is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },

    {
      name: 'vasDateNextVisit2',
      label: 'Date of next visit',
      type: 'date',
      validate: yup
        .date()
        .min(new Date(), 'Date of visit cannot be in the past')
        .required('Date visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },
     
  ],

  'Dose(200,000 IU):at 18 months (1 1/2 years)': [
    {
        name: 'ageGiven3',
        label: 'Age Given',
        type: 'text',
        validate: yup.number().required('Age given is required'),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 3,
        },
      },
    {
      name: 'vasDateGiven3',
      label: 'Date of vitamin A supplement given',
      type: 'date',
      validate: yup
        .date()
        .max(new Date(), 'Date of vaccine cannot be in the future')
        .required('Date vaccine is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },

    {
      name: 'vasDateNextVisit3',
      label: 'Date of next visit',
      type: 'date',
      validate: yup
        .date()
        .min(new Date(), 'Date of visit cannot be in the past')
        .required('Date visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },
     
  ],

  'Dose(200,000 IU):at 24 months (2 years)': [
    {
        name: 'ageGiven4',
        label: 'Age Given',
        type: 'text',
        validate: yup.number().required('Age given is required'),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 3,
        },
      },
    {
      name: 'vasDateGiven4',
      label: 'Date of vitamin A supplement given',
      type: 'date',
      validate: yup
        .date()
        .max(new Date(), 'Date of vaccine cannot be in the future')
        .required('Date vaccine is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },

    {
      name: 'vasDateNextVisit4',
      label: 'Date of next visit',
      type: 'date',
      validate: yup
        .date()
        .min(new Date(), 'Date of visit cannot be in the past')
        .required('Date visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },
     
  ],

  'Dose(200,000 IU):at 30 months (2 1/2 years)': [
    {
        name: 'ageGiven5',
        label: 'Age Given',
        type: 'text',
        validate: yup.number().required('Age given is required'),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 3,
        },
      },
    {
      name: 'vasDateGiven5',
      label: 'Date of vitamin A supplement given',
      type: 'date',
      validate: yup
        .date()
        .max(new Date(), 'Date of vaccine cannot be in the future')
        .required('Date vaccine is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },

    {
      name: 'vasDateNextVisit5',
      label: 'Date of next visit',
      type: 'date',
      validate: yup
        .date()
        .min(new Date(), 'Date of visit cannot be in the past')
        .required('Date visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },
     
  ],

  'Dose(200,000 IU):at 36 months (3 years)': [
    {
        name: 'ageGiven6',
        label: 'Age Given',
        type: 'text',
        validate: yup.number().required('Age given is required'),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 3,
        },
      },
    {
      name: 'vasDateGiven6',
      label: 'Date of vitamin A supplement given',
      type: 'date',
      validate: yup
        .date()
        .max(new Date(), 'Date of vaccine cannot be in the future')
        .required('Date vaccine is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },

    {
      name: 'vasDateNextVisit6',
      label: 'Date of next visit',
      type: 'date',
      validate: yup
        .date()
        .min(new Date(), 'Date of visit cannot be in the past')
        .required('Date visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },
     
  ],

  'Dose(200,000 IU):at 42 months (3 1/2 years)': [
    {
        name: 'ageGiven7',
        label: 'Age Given',
        type: 'text',
        validate: yup.number().required('Age given is required'),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 3,
        },
      },
    {
      name: 'vasDateGiven7',
      label: 'Date of vitamin A supplement given',
      type: 'date',
      validate: yup
        .date()
        .max(new Date(), 'Date of vaccine cannot be in the future')
        .required('Date vaccine is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },

    {
      name: 'vasDateNextVisit7',
      label: 'Date of next visit',
      type: 'date',
      validate: yup
        .date()
        .min(new Date(), 'Date of visit cannot be in the past')
        .required('Date visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },
     
  ],

  'Dose(200,000 IU):at 48 months (4 years)': [
    {
        name: 'ageGiven8',
        label: 'Age Given',
        type: 'text',
        validate: yup.number().required('Age given is required'),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 3,
        },
      },
    {
      name: 'vasDateGiven8',
      label: 'Date of vitamin A supplement given',
      type: 'date',
      validate: yup
        .date()
        .max(new Date(), 'Date of vaccine cannot be in the future')
        .required('Date vaccine is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },

    {
      name: 'vasDateNextVisit3',
      label: 'Date of next visit',
      type: 'date',
      validate: yup
        .date()
        .min(new Date(), 'Date of visit cannot be in the past')
        .required('Date visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },
     
  ],

  'Dose(200,000 IU):at 54 months (4 1/2 years)': [
    {
        name: 'ageGiven9',
        label: 'Age Given',
        type: 'text',
        validate: yup.number().required('Age given is required'),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 3,
        },
      },
    {
      name: 'vasDateGiven9',
      label: 'Date of vitamin A supplement given',
      type: 'date',
      validate: yup
        .date()
        .max(new Date(), 'Date of vaccine cannot be in the future')
        .required('Date vaccine is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },

    {
      name: 'vasDateNextVisit9',
      label: 'Date of next visit',
      type: 'date',
      validate: yup
        .date()
        .min(new Date(), 'Date of visit cannot be in the past')
        .required('Date visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },
     
  ],

  'Dose(200,000 IU):at 59 months (5 years)': [
    {
        name: 'ageGiven10',
        label: 'Age Given',
        type: 'text',
        validate: yup.number().required('Age given is required'),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 3,
        },
      },
    {
      name: 'vasDateGiven10',
      label: 'Date of vitamin A supplement given',
      type: 'date',
      validate: yup
        .date()
        .max(new Date(), 'Date of vaccine cannot be in the future')
        .required('Date vaccine is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },

    {
      name: 'vasDateNextVisit10',
      label: 'Date of next visit',
      type: 'date',
      validate: yup
        .date()
        .min(new Date(), 'Date of visit cannot be in the past')
        .required('Date visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 5,
      },
    },
     
  ],

};

export default vitaminAsupplementationFields;