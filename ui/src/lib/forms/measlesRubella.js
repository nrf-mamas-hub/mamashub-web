import * as yup from 'yup';

const measlesRubellaVaccinationFields = {
    'MEASLES RUBELLA VACCINE (MR) at 6 months (Dose: 0.5ml, deep subcutaneous injection into the right upper arm deltoid muscle)': [
        {
            name: 'batchNumber',
            label: 'Batch number',
            type: 'text',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
            validate: yup.string().required('Batch number is required'),
        },
        {
            name: 'lotNumber',
            label: 'Lot number',
            type: 'text',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
            validate: yup.string().required('Lot number is required'),
        },
        {
            name: 'manufacturer',
            label: 'Manufacturer',
            type: 'text',
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
            validate: yup.string().required('Manufacturer is required'),
        },
        {
            name: 'dateOfExpiry',
            label: 'Date of expiry',
            type: 'date',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
            validate: yup.date().required('Date of expiry is required')
        },
        {
            name: 'dateGiven',
            label: 'Date given',
            type: 'date',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
            validate: yup.date().required('Date given is required'),
        },
        {
            name: 'dateOfNextVisit',
            label: 'Date of next visit',
            type: 'date',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
            validate: yup.date().required('Date of next visit is required')
        }
    ],
    'MEASLES RUBELLA VACCINE (MR) at 9 months (Dose: 0.5ml, deep subcutaneous injection, over the deltoid muscle, upper right arm)': [
        {
            name: 'batchNumber',
            label: 'Batch number',
            type: 'text',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
            validate: yup.string().required('Batch number is required'),
        },
        {
            name: 'lotNumber',
            label: 'Lot number',
            type: 'text',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
            validate: yup.string().required('Lot number is required'),
        },
        {
            name: 'manufacturer',
            label: 'Manufacturer',
            type: 'text',
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
            validate: yup.string().required('Manufacturer is required'),
        },
        {
            name: 'dateOfExpiry',
            label: 'Date of expiry',
            type: 'date',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
            validate: yup.date().required('Date of expiry is required')
        },
        {
            name: 'dateGiven',
            label: 'Date given',
            type: 'date',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
            validate: yup.date().required('Date given is required'),
        },
        {
            name: 'dateOfNextVisit',
            label: 'Date of next visit',
            type: 'date',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
            validate: yup.date().required('Date of next visit is required')
        }
    ],
    'MEASLES RUBELLA VACCINE (MR) at 18 Months (Dose: 0.5ml, deep subcutaneous injection, over the deltoid muscle, upper right arm)': [
        {
            name: 'batchNumber',
            label: 'Batch number',
            type: 'text',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
            validate: yup.string().required('Batch number is required'),
        },
        {
            name: 'lotNumber',
            label: 'Lot number',
            type: 'text',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
            validate: yup.string().required('Lot number is required'),
        },
        {
            name: 'manufacturer',
            label: 'Manufacturer',
            type: 'text',
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
            validate: yup.string().required('Manufacturer is required'),
        },
        {
            name: 'dateOfExpiry',
            label: 'Date of expiry',
            type: 'date',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
            validate: yup.date().required('Date of expiry is required')
        },
        {
            name: 'dateGiven',
            label: 'Date given',
            type: 'date',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
            validate: yup.date().required('Date given is required'),
        }
    ]
}

export default measlesRubellaVaccinationFields;