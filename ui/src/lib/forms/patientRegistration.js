import counties from '../../data/counties.json';
import * as yup from 'yup';

const formData = {
  'Facility Details': [
    {
      name: 'facilityName',
      label: 'Name of Facility',
      type: 'text',
      required: true,
      disabled: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'kmhflCode',
      label: 'KMHFL Code',
      disabled: true,
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
  ],
  'Client Details': [
    {
      name: 'ancCode',
      label: 'ANC Code',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.string().required('ANC Code is required'),
    },
    {
      name: 'pncNumber',
      label: 'PNC No',
      type: 'text',
      required: false,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
    },
    {
      name: 'names',
      label: 'Name of Client',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.string().required('Name of client is required'),
    },
    {
      name: 'dob',
      label: 'Date of Birth',
      type: 'date',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.date().required('Date of birth is required').test(
        "dob_test",
        "DOB must be between 10 and 49 yrs and cannot be a future date.",
        function (value) {
          // const { startDate } = this.parent;
          const date = new Date(value);
          return (date.getTime() < (new Date()).getTime()) && (
            (new Date().getFullYear() - date.getFullYear()) > 9
          ) && ((new Date().getFullYear() - date.getFullYear()) < 50);
        }
      ),
    },
    {
      name: 'idNumber',
      label: 'ID Number',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.string().required('ID Number is required'),
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.string().required('Phone number is required'),
    },
    {
      name: 'educationLevel',
      label: 'Education Level',
      type: 'select',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      options: [
        { value: "Don't know level of education", label: "Don't know level of education" },
        { value: "No education", label: "No education" },
        { value: 'Primary School', label: 'Primary School' },
        { value: 'Secondary School', label: 'Secondary School' },
        { value: 'Higher education', label: 'Higher education' },
      ],
      validate: yup.string().required('Education level is required'),
    },
    {
      name: 'maritalStatus',
      label: 'Marital Status',
      type: 'select',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      options: [
        { value: 'Single', label: 'Single' },
        { value: 'Married', label: 'Married' },
        { value: 'Separated', label: 'Separated' },
        { value: 'Widowed', label: 'Widowed' },
      ],
      validate: yup.string().required('Marital status is required'),
    },
  ],
  Residence: [
    {
      name: 'county',
      label: 'County',
      type: 'select',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
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
        lg: 4,
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
        lg: 4,
      },
      options: [],
      validate: yup.string().required('Ward is required'),
    },
    {
      name: 'estate',
      label: 'Estate',
      type: 'text',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.string(),
    },
    {
      name: 'town',
      label: 'Town/Village',
      type: 'text',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.string(),
    },
    {
      name: 'physicalAddress',
      label: 'Physical Address',
      type: 'text',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.string(),
    },

  ],
  'Next of Kin': [
    {
      name: 'nextOfKinName',
      label: 'Next of Kin Names',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.string().required('Next of kin name is required'),
    },
    {
      name: 'nextOfKinRelationship',
      label: 'Relationship',
      type: 'select',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      options: [
        { value: 'Spouse', label: 'Spouse' },
        { value: 'Parent', label: 'Parent' },
        { value: 'Sibling', label: 'Sibling' },
        { value: 'Child', label: 'Child' },
        { value: 'Relatives', label: 'Relatives' },
      ],
      validate: yup.string().required('Relationship is required'),
    },
    {
      name: 'nextOfKinPhone',
      label: 'Phone Number',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.string().required('Phone number is required'),
    },
  ],
  'Clinical Information': [
    {
      name: 'gravida',
      label: 'Gravida',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.number().required('Gravida is required'),
    },
    {
      name: 'parity',
      label: 'Parity',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      // parity cannot be greater than gravida
      validate: yup.number().required('Parity is required').test(
        "parity_test",
        "Parity cannot be greater than Gravida",
        function (value) {
          const { gravida } = this.parent;
          return value <= gravida;
        }
      ),
    },
    {
      name: 'height',
      label: 'Height (cm)',
      type: 'text',
      required: false,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.number().required('Height is required'),
    },
    {
      name: 'weight',
      label: 'Weight (kg)',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.number().required('Weight is required'),
    },
    {
      name: 'lmp',
      label: 'LMP',
      type: 'date',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.date().required('LMP is required').min(new Date(new Date().setMonth(new Date().getMonth() - 1)), "LMP cannot be less than a month ago"),
    },
    {
      name: 'edd',
      label: 'EDD',
      type: 'date',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      // validate: yup.date().required('EDD is required'),
    },
  ],
};

export default formData;