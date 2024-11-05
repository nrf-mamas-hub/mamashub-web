import * as yup from 'yup'; 
import counties from '../../data/counties.json';

const childCivilRegistrationDetailsForm = {
  'A.Particulars Of the Child': [
    {
      name: 'names',
      label: 'Name Of Child',
      type: 'text',
      validate: yup.string().required("Name of child is required"),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'sex',
      label: 'Sex Of Child',
      type: 'text',
      validate: yup.string().required("The Sex of the Child is required"),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'gestationAtBirth',
      label: 'Gestation At Birth (in weeks)',
      type: 'text',
      validate: yup
      .number()
      .typeError('Gestation must be a number') // Ensures only numbers are allowed
      .required('Gestation At Birth is required'),
    width:  {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'dateOfBirth',
      label: 'Date Of Birth (DD/MM/YY)',
      type: 'date',
      validate: yup.date().required("The Date of birth is required"),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'birthWeight',
      label: 'Birth Weight (gms)',
      type: 'text',
      validate: yup
        .number()
        .typeError('Birth weight must be a number') // Ensures only numbers are allowed
        .required('Birth weight is required')
        .min(500, 'Weight should be at least 500 grams'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'birthLength',
      label: 'Birth Length (cm)',
      type: 'text',
      validate: yup
      .number()
      .typeError('Birth Length must be a number') // Ensures only numbers are allowed
      .required('Birth Length is required'),
    width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'otherBirthCharacteristics',
      label: 'Other Birth Characteristics',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
      },
    },
    {
      name: 'birthOrder',
      label: 'Birth Order in Family (e.g., 1st, 2nd, 3rd born)',
      type: 'select',
      validate: yup.string().required('Birth order is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        { label: '1st born', value: '1st' },
        { label: '2nd born', value: '2nd' },
        { label: '3rd born', value: '3rd' },
        { label: '4th born', value: '4th' },
        { label: '5th born', value: '5th' },
        { label: '6th born', value: '6th' },
        { label: 'Other', value: 'Other' },
      ],
    },
    {
      name: 'dateFirstSeen',
      label: 'Date 1st Seen (DD/MM/YY)',
      type: 'date',
      validate: yup.date().required("The date first seen is required"),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
  ],

'B. Health Record of Child:': [
  {
    name: 'placeOfBirth',
    label: 'Place of Birth',
    type: 'select',
    validate: yup.string().required('Place of Birth is required'),
    width: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
    options: [
      { label: 'Health Facility',Name: 'placeOfBirthHealthFacility',  value: 'Health Facility' },
      { label: 'Home',Name: 'placeOfBirthHome', value: 'Home' },
      { label: 'Other',Name: 'placeOfBirthOther', value: 'Other' },
    ],
  },
  {
    name: 'otherHealthFacility',
    label: 'If Other, Specify',
    type: 'text',
    width: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
    },
    relevant: formValues => formValues.placeOfBirth === 'Other',
  },

    {
      name: 'birthNotificationNumber',
      label: 'Birth Notification No.',
      type: 'text',
      validate: yup.string().required('Birth notification number is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
      },
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      validate: yup.date().required('Date is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
      },
    },
    {
      name: 'iprNumber',
      label: 'Immunization Permanent Register No.',
      type: 'text',
      validate: yup.string()
      .required('Immunization register number is required'),
      
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
      },
    },
    {
      name: 'cwcNumber',
      label: 'Child Welfare Clinic (CWC) No.',
      type: 'text',
      validate: yup.string().required('CWC number is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
      },
    },
    {
      name: 'healthFacilityName',
      label: 'Health Facility Name',
      type: 'text',
      validate: yup.string().required('Health facility name is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
      },
    },
    {
      name: 'kmhflCode',
      label: 'Master Facility List (KMHFL) Code',
      type: 'text',
      validate: yup.string().required('KMHFL code is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
      },
    },
  ],  
 
   
'C. Civil Registration': [
  {
    name: 'birthCertificateNumber',
    label: 'Birth Certificate No.',
    type: 'text',
    validate: yup.string().required('Birth certificate number is required'),
    width: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },
  {
    name: 'dateOfRegistration',
    label: 'Date of Registration',
    type: 'date',
    validate: yup.date().required('Date of registration is required'),
    width: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },
  {
    name: 'placeOfRegistration',
    label: 'Place of Registration',
    type: 'text',
    validate: yup.string().required('Place of registration is required'),
    width: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
    },
  },
],

'D. Civil Registration': [
  {
    name: 'fatherName',
    label: "Father's Name",
    type: 'text',
    validate: yup.string(),
    width: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },
  {
    name: 'fatherPhone',
    label: "Father's Tel No.",
    type: 'text',
    validate: yup
      .number()
      .typeError('must be a number'),
    width: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },
  {
    name: 'motherName',
    label: "Mother's Name",
    type: 'text',
    validate: yup.string().required("Mother's name is required"),
    width: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },
  {
    name: 'motherPhone',
    label: "Mother's Tel No.",
    type: 'text',
    validate: yup.string().required("Mother's telephone number is required")
      .typeError('must be a number'),
    width: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },
  {
    name: 'guardianName',
    label: "Guardian's Name (if applicable)",
    type: 'text',
    validate: yup.string(),
    width: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },
  {
    name: 'guardianPhone',
    label: "Guardian's Tel No.",
    type: 'text',
    validate: yup
    .number()
    .typeError('must be a number'),
    width: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },

  {
    name: 'residenceOfChild',
    label: 'Residence of Child',
    type: 'text',
    validate: yup.string().required('Residence Of Child is required'),
    width: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },



  {
    name: 'county',
    label: 'County',
    type: 'select',
    required: true,
    width: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 6,
    },
    options: counties.map(county => ({
      label: county.name,
      value: county.name,
    })),
    validate: yup.string().required('County is required'),
  },
  {
    name: 'subCounty',
    label: 'Sub-County',
    type: 'select',
    required: true,
    width: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 6,
    },
    options: [],
    validate: yup.string().required('Sub-County is required'),
  },
  {
    name: 'ward',
    label: 'Ward',
    type: 'select',
    required: true,
    width: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 6,
    },
    options: [],
    validate: yup.string().required('Ward is required'),
  },

  {
    name: 'residenceTownWard',
    label: 'Town/Trading Centre/Ward',
    type: 'text',
    validate: yup.string(),
    width: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },
  {
    name: 'residenceEstateHouseNo',
    label: 'Estate & House No./Village',
    type: 'text',
    validate: yup.string(),
    width: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },
  {
    name: 'postalAddress',
    label: 'Postal Address',
    type: 'text',
    validate: yup.string(),
    width: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 6,
    },
  },
],
  
};

// Export the forms as named exports
export default childCivilRegistrationDetailsForm;