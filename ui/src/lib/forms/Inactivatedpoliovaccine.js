import * as yup from 'yup'; 
const inactivatedPolioVaccineDetailsForm = {
    'IPV (Inactivated Polio Vaccine) - IPV (0.5mls) Dose at 14 weeks. Intramuscular injection into the outer aspect of the right thigh, positioned 2.5 cm (2 fingers apart) from the site of the PCV10 injection.': [
        {
            name: 'dategiven',
            label: 'Date Given (DD/MM/YY)',
            type: 'date',
            validate: yup.date().required("The Date of Next Vist is required"),
            width: {
              xs: 12,
              sm: 12,
              md: 12,
              lg: 6,
            },
          },
      {
        name: 'dateofnextvisit',
        label: 'Date Of Next Visit (DD/MM/YY)',
        type: 'date',
        validate: yup.date().required("The Date of Next Vist is required"),
        width: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 6,
        },
      },
    ]
};
export default inactivatedPolioVaccineDetailsForm;