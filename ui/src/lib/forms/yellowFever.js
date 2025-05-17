import * as yup from 'yup';

const yellowFeverVaccinationFields = {
    'YELLOW FEVER VACCINE at 9 months (Dose: (0.5mls) Intra Muscular left upper deltoid)': [
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
            validate: yup.string().required('Batch number is required')
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
                lg: 6
            },
            validate: yup.string().required('Lot number is required')
        },
        {
            name: 'manufacturer',
            label: 'Manufacturer',
            type: 'text',
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
            type: 'date',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6
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
                lg: 6
            },
            validate: yup.date().required('Date given is required')
        }
    ]
}

export default yellowFeverVaccinationFields;