import * as yup from 'yup';

const diphtheriaVaccinationFields ={
    '1st Dose at 6 weeks' : [
        {
            name: 'batchNumber',
            label: 'Batch number',
            type:'text',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
              validate: yup
              .string().required('Batch number is required')
        },
        {
            name: 'lotNumber',
            label: 'Lot number',
            type:'text',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
              validate: yup
              .string().required('Lot number is required')
        },
        {
            name: 'Manufacturer',
            label: 'Manufacturer',
            type:'text',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },

        },
        {
            name: 'dateOfExpiry',
            label: 'Date of expiry',
            type:'date',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
              validate: yup
              .date().required('Date of expiry is required')
        },
        {
            name: 'dateGiven',
            label: 'Date given',
            type:'date',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
              validate: yup
              .date().required('Date given is required')
        },
        {
            name:'dateOfNextVisit',
            label:'Date of next visit',
            type:'date',
            required:true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
              validate: yup
              .date().required('Date of next visit is required')
        }
    ],
   '2nd Dose at 10 weeks' : [
    {
        name: 'batchNumber',
        label: 'Batch number',
        type:'text',
        required: true,
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,
          },
          validate: yup
          .string().required('Batch number is required')
    },
    {
        name: 'lotNumber',
        label: 'Lot number',
        type:'text',
        required: true,
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,
          },
          validate: yup
          .string().required('Lot number is required')
    },
    {
        name: 'Manufacturer',
        label: 'Manufacturer',
        type:'text',
        required: true,
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,
          },
    },
    {
        name: 'dateOfExpiry',
        label: 'Date of expiry',
        type:'date',
        required: true,
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,
          },
          validate: yup
          .date().required('Date of expiry is required')
    },
    {
        name: 'dateGiven',
        label: 'Date given',
        type:'date',
        required: true,
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,
          },
          validate: yup
          .date().required('Date given is required')
    },
    {
        name:'dateOfNextVisit',
        label:'Date of next visit',
        type:'date',
        required:true,
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,
          },
          validate: yup
          .date().required('Date of next visit is required')
    }
   ],
   '3rd Dose at 14 weeks' : [
    {
        name: 'batchNumber',
        label: 'Batch number',
        type:'text',
        required: true,
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,
          },
          validate: yup
          .string().required('Batch number is required')
    },
    {
        name: 'lotNumber',
        label: 'Lot number',
        type:'text',
        required: true,
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,
          },
          validate: yup
          .string().required('Lot number is required')
    },
    {
        name: 'Manufacturer',
        label: 'Manufacturer',
        type:'text',
        required: true,
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,
          },
    },
    {
        name: 'dateOfExpiry',
        label: 'Date of expiry',
        type:'date',
        required: true,
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,
          },
          validate: yup
          .date().required('Date of expiry is required')
    },
    {
        name: 'dateGiven',
        label: 'Date given',
        type:'date',
        required: true,
        width: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 6,
          },
          validate: yup
          .date().required('Date given is required')
    }
   ] 
}

export default diphtheriaVaccinationFields;