import * as yup from 'yup';

const childBirthFields = {
  'Mothers conditions': [
    {
      name: 'durationOfPregnancy',
      label: 'Duration of pregnancy in weeks',
      type: 'text',
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      validate: yup
        .number()
        .required('Duration of pregnancy is required')
        .max(36, 'Pregnancy duration cannot exceed 36 weeks')
        .integer('Duration must be a whole number')
        .positive('Duration must be a positive number'),
    },
    {
      label: 'HIV test',
      name: 'hivTestBeforeChildbirthYesOrNo',
      type: 'radio',
      validate: yup.string().required('Please specify if HIV test was conducted'),
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ],
    },
    {
      label: 'HIV test result',
      name: 'hivStatusAtChildbirthResultYes',
      type: 'radio',
      validate: yup.string().when('hivTestBeforeChildbirthYesOrNo', {
        is: 'Yes',
        then: yup.string().required('HIV test result is required when test was conducted'),
        otherwise: yup.string(),
      }),
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      options: [
        { label: 'Reactive', value: 'Reactive' },
        { label: 'NR (Non-Reactive)', value: 'NR' },
      ],
      relevant: (formValues) => formValues.hivTestBeforeChildbirthYesOrNo === 'Yes',
    },
    {
      label: 'HIV test counsel and test',
      type: 'radio',
      name: 'hivStatusAtChildbirthResultNo',
      validate: yup.string().when('hivTestBeforeChildbirthYesOrNo', {
        is: 'No',
        then: yup.string().required('Please specify the counseling and testing result'),
        otherwise: yup.string(),
      }),
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      options: [
        { label: 'Reactive', value: 'Reactive' },
        { label: 'NR (Non-Reactive)', value: 'NR' },
        { label: 'Not tested', value: 'Not tested' },
      ],
      relevant: (formValues) => formValues.hivTestBeforeChildbirthYesOrNo === 'No',
    },
  ],
  'During delivery': [
    {
      name: 'modeOfDelivery',
      label: 'Mode of delivery',
      type: 'radio',
      validate: yup.string().required('Mode of delivery is required'),
      options: [
        { label: 'Vaginal delivery', value: 'Vaginal delivery' },
        { label: 'Assisted Vaginal delivery', value: 'Assisted Vaginal delivery' },
        { label: 'Caesarean section', value: 'Caesarean section' },
      ],
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
    },
    {
      name: 'dateOfDelivery',
      label: 'Date of delivery',
      type: 'date',
      validate: yup
        .date()
        .required('Date of delivery is required')
        .max(new Date(), 'Delivery date cannot be in the future')
        .min(new Date('1900-01-01'), 'Please enter a valid delivery date'),
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
    },
    {
      name: 'timeOfDelivery',
      label: 'Time of delivery',
      type: 'text',
      validate: yup
        .string()
        .required('Time of delivery is required')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format. Please use HH:MM in 24-hour format (e.g., 14:30)'),
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
    },
    {
      label: "Baby placed on mother's abdomen immediately the baby is born",
      type: 'radio',
      name: 'babyPlacementOnMothersAbdomen',
      validate: yup.string().required("Please specify if baby was placed on mother's abdomen"),
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ],
    },
    {
      label: 'Apgar score in one minute (0 - 10)',
      name: 'apgarScoreOneMinute',
      type: 'text',
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup
        .number()
        .required('Apgar score at 1 minute is required')
        .min(0, 'Apgar score cannot be less than 0')
        .max(10, 'Apgar score cannot be greater than 10')
        .integer('Apgar score must be a whole number'),
    },
    {
      label: 'Apgar score in Five minute (0 - 10)',
      name: 'apgarScoreFiveMinutes',
      type: 'text',
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup
        .number()
        .required('Apgar score at 5 minutes is required')
        .min(0, 'Apgar score cannot be less than 0')
        .max(10, 'Apgar score cannot be greater than 10')
        .integer('Apgar score must be a whole number'),
    },
    {
      label: 'Apgar score in Ten minute (0 -10)',
      name: 'apgarScoreTenMinutes',
      type: 'text',
      width: { xs: 12, sm: 12, md: 12, lg: 4 },
      validate: yup
        .number()
        .required('Apgar score at 10 minutes is required')
        .min(0, 'Apgar score cannot be less than 0')
        .max(10, 'Apgar score cannot be greater than 10')
        .integer('Apgar score must be a whole number'),
    },
    {
      label: 'Resuscitation done',
      name: 'resuscitationDone',
      type: 'radio',
      validate: yup.string().required('Please specify if resuscitation was done'),
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ],
    },
    {
      label: 'Blood loss in millilitres(ml)',
      name: 'bloodLoss',
      type: 'text',
      validate: yup
        .number()
        .required('Blood loss measurement is required')
        .min(0, 'Blood loss cannot be negative')
        .max(5000, 'Please verify blood loss amount - seems unusually high')
        .integer('Blood loss must be a whole number'),
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
    },
    {
      label: 'Any Conditions',
      name: 'complicationsDuringChildbirth',
      type: 'select',
      validate: yup.string(),
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      options: [
        { label: 'Pre-eclampsia', value: 'Pre-eclampsia' },
        { label: 'Eclampsia', value: 'Eclampsia' },
        { label: 'PPH (Postpartum Hemorrhage)', value: 'PPH' },
        { label: 'None', value: 'None' },
      ],
    },
    {
      label: 'Obstructed labour',
      name: 'obstructedLabor',
      type: 'radio',
      validate: yup.string().required('Please specify if there was obstructed labor'),
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ],
    },
    {
      label: 'Condition of the mother',
      name: 'mothersCondition',
      type: 'text',
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      validate: yup
        .string()
        .required('Mother\'s condition is required')
        .min(3, 'Please provide more detail about mother\'s condition')
        .max(500, 'Description is too long'),
    },
    {
      label: 'Meconium stained liquor',
      name: 'meconiumStainedLiquor',
      type: 'radio',
      validate: yup.string().required('Please specify if meconium stained liquor was present'),
      width: { xs: 12, sm: 12, md: 12, lg: 9 },
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ],
    },
    {
      label: 'Conducted by',
      type: 'select',
      name: 'deliveryConductedBy',
      validate: yup.string().required('Please specify who conducted the delivery'),
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      options: [
        { label: 'Nurse', value: 'Nurse' },
        { label: 'Midwife', value: 'Midwife' },
        { label: 'Clinical Officer', value: 'Clinical Officer' },
        { label: 'Doctor', value: 'Doctor' },
        { label: 'Traditional Birth Attendant', value: 'Traditional Birth Attendant' },
      ],
    },
  ],

  'Drugs administered to the Mother': [
    {
      label: 'Oxytocin/Misoprostol/Heat stable carbetocin',
      type: 'checkbox',
      validate: yup.array().of(yup.string()).min(0, 'Select applicable drugs or leave empty if none'),
      name: 'motherDrugAdminsteredAtChildbirth',
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      options: [
        { label: 'Oxytocin', value: 'Oxytocin' },
        { label: 'Misoprostol', value: 'Misoprostol' },
        { label: 'Heat stable carbetocin', value: 'Heat stable carbetocin' },
        { label: 'None', value: 'None' },
      ],
    },
    {
      label: 'HIV Status - HAART (Highly Active Antiretroviral Therapy)',
      name: 'motherHivStatusPositiveHaart',
      type: 'radio',
      validate: yup.string().when(['hivStatusAtChildbirthResultYes', 'hivStatusAtChildbirthResultNo'], {
        is: (resultYes, resultNo) => resultYes === 'Reactive' || resultNo === 'Reactive',
        then: yup.string().required('HAART status is required for HIV positive mothers'),
        otherwise: yup.string(),
      }),
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ],
    },
    {
      label: 'Specify regimen',
      name: 'motherHaartRegimen',
      type: 'text',
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      validate: yup.string().when('motherHivStatusPositiveHaart', {
        is: 'Yes',
        then: yup.string()
          .required('Please specify the HAART regimen')
          .min(2, 'Please provide the specific regimen details'),
        otherwise: yup.string(),
      }),
      relevant: (formValues) => formValues.motherHivStatusPositiveHaart === 'Yes',
    },
    {
      label: 'Other drugs specify',
      name: 'motherOtherDrugsAdminsteredAtChildbirth',
      type: 'text',
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      validate: yup.string().max(200, 'Description is too long'),
    },
  ],

  // Drugs administered to the Baby
  'Drugs administered to the Baby': [
    {
      label: 'Drugs administered to the Baby',
      name: 'babyDrugAdminsteredAtChildbirth',
      type: 'checkbox',
      validate: yup.array().of(yup.string()).min(0, 'Select applicable drugs or leave empty if none'),
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      options: [
        { label: 'CHX 7.1%', value: 'CHX 7.1%' },
        { label: 'Vit K', value: 'Vit K' },
        { label: 'TEO (Tetracycline Eye Ointment)', value: 'TEO' },
        { label: 'None', value: 'None' },
      ],
    },
    {
      label: 'Is the baby Exposed to HIV',
      name: 'babyHivExposed',
      type: 'radio',
      validate: yup.string().when(['hivStatusAtChildbirthResultYes', 'hivStatusAtChildbirthResultNo'], {
        is: (resultYes, resultNo) => resultYes === 'Reactive' || resultNo === 'Reactive',
        then: yup.string().required('HIV exposure status is required when mother is HIV positive'),
        otherwise: yup.string().required('Please specify HIV exposure status'),
      }),
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ],
    },
    {
      label: 'Specify ART prophylaxis given',
      name: 'babyArtProphylaxisGiven',
      type: 'text',
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      validate: yup.string().when('babyHivExposed', {
        is: 'Yes',
        then: yup.string()
          .required('ART prophylaxis details are required for HIV exposed babies')
          .min(2, 'Please provide specific prophylaxis details'),
        otherwise: yup.string(),
      }),
      relevant: (formValues) => formValues.babyHivExposed === 'Yes',
    },
    {
      label: 'Other drugs specify',
      name: 'babyOtherDrugsAdminsteredAtChildbirth',
      type: 'text',
      validate: yup.string().max(200, 'Description is too long'),
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
    },
  ],

  // Baby's details
  "Baby's details": [
    {
      label: "Baby's condition",
      name: 'babysCondition',
      type: 'text',
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      validate: yup
        .string()
        .required('Baby\'s condition is required')
        .min(3, 'Please provide more detail about baby\'s condition')
        .max(500, 'Description is too long'),
    },
    {
      label: "Birth Weight (grams)",
      name: 'birthWeight',
      type: 'text',
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      validate: yup
        .number()
        .required('Birth weight is required')
        .min(500, 'Birth weight seems too low - please verify')
        .max(8000, 'Birth weight seems too high - please verify')
        .integer('Birth weight must be a whole number'),
    },
    {
      label: "Birth Length (cm)",
      name: 'birthLength',
      type: 'text',
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      validate: yup
        .number()
        .required('Birth length is required')
        .min(30, 'Birth length seems too short - please verify')
        .max(70, 'Birth length seems too long - please verify')
        .positive('Birth length must be positive'),
    },
    {
      label: "Head circumference (cm)",
      name: 'headCircumference',
      type: 'text',
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      validate: yup
        .number()
        .required('Head circumference is required')
        .min(15, 'Head circumference seems too small - please verify')
        .max(30, 'Head circumference seems too large - please verify')
        .positive('Head circumference must be positive'),
    },
    {
      label: 'Place of childbirth',
      name: 'placeOfChildbirth',
      type: 'radio',
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      validate: yup.string().required('Place of childbirth is required'),
      options: [
        { label: 'Health facility', value: 'Health facility' },
        { label: 'Home', value: 'Home' },
        { label: 'Other', value: 'Other' },
      ],
    },
    {
      label: 'Other (specify)',
      name: 'otherPlaceOfChildbirth',
      type: 'text',
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      validate: yup.string().when('placeOfChildbirth', {
        is: 'Other',
        then: yup.string()
          .required('Please specify the place of childbirth')
          .min(2, 'Please provide more detail'),
        otherwise: yup.string(),
      }),
      relevant: (formValues) => formValues.placeOfChildbirth === 'Other',
    },
    {
      label: 'Early initiation of breastfeeding within 1 hour after childbirth',
      name: 'EarlyInitiationOfBreastfeeding',
      type: 'radio',
      validate: yup.string().required('Please specify if early breastfeeding was initiated'),
      width: { xs: 12, sm: 12, md: 12, lg: 6 },
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ],
    },
  ],
};

export default childBirthFields;