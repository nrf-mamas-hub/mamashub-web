import { validate } from "uuid";
import * as yup from "yup";

const congenitalAbnormalitiesFields = {
    'Head size': [
        {
            name: 'headSize',
            label: 'Head size',
            type: 'radio',
            options: [
                { label: 'Normal', value: 'normal' },
                { label: 'Abnormal', value: 'abnormal' },
            ],
            validate: yup.string().required('Head size is required'),
            width: {
                xs: 12,
                sm: 12,
                md: 6,
                lg: 6,
            },
        },
        {
            name: 'headSizeAbnormalType',
            label: 'Head size abnormal type',
            type: 'checkbox',
            validate: yup.array()
                .of(yup.string())
                .when('headSize', {
                is: 'abnormal',
                then: (schema) =>
                    schema
                    .min(1, 'Please select at least one abnormal type')
                    .required('Head size abnormal type is required'),
                otherwise: (schema) => schema.notRequired(),
                }),
            options: [
                { label: 'Extra small (microcephalic)', value: 'microcephalic' },
                { label: 'Extra large (hydrocephalic)', value: 'hydrocephalic' },
                { label: 'Others Specify', value: 'headSizeOtherSpecify' },
            ],
            width: {
                xs: 12,
                sm: 12,
                md: 6,
                lg: 6,
            },
            relevant: formValues => formValues.headSize === 'abnormal',
        },          
        {
            name: 'headSizeOtherSpecifyType',
            label: 'Other Specify',
            type: 'text',
            validate: yup.string().when(['headSize', 'headSizeAbnormalType'], {
              is: (headSize, abnormalTypes) =>
                headSize === 'abnormal' &&
                Array.isArray(abnormalTypes) &&
                abnormalTypes.includes('headSizeOtherSpecify'),
              then: yup.string().required('Please specify the other abnormal type'),
              otherwise: yup.string().notRequired(),
            }),
            width: {
              xs: 12,
              sm: 12,
              md: 6,
              lg: 6,
            },
            relevant: (formValues) =>
              formValues.headSize === 'abnormal' &&
              Array.isArray(formValues.headSizeAbnormalType) &&
              formValues.headSizeAbnormalType.includes('headSizeOtherSpecify'),
          }
          ,
        {
            name: 'headSizeRemarks',
            label: 'Remarks',
            type: 'text',
            validate: yup.string().required('Remarks are required'),
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
        }
    ],
    'Mouth and Gums': [
        {
            name: 'mouthAndGums',
            label: 'Mouth and Gums',
            type: 'radio',
            options: [
                { label: 'Normal', value: 'normal' },
                { label: 'Abnormal', value: 'abnormal' },
            ],
            validate: yup.string().required('Mouth and gums status is required'),
            width: {
                xs: 12,
                sm: 12,
                md: 6,
                lg: 6,
            },
        },
        {
            name: 'mouthAndGumsAbnormalType',
            label: 'Mouth and Gums abnormal type',
            type: 'checkbox',
            validate: yup.array()
                .of(yup.string())
                .when('mouthAndGums', {
                is: 'abnormal',
                then: (schema) =>
                    schema
                    .min(1, 'Please select at least one abnormal type')
                    .required('Mouth and gums abnormal type is required'),
                otherwise: (schema) => schema.notRequired(),
                }),
            options: [
                { label: 'Cleft lip', value: 'cleftLip' },
                { label: 'Cleft palate', value: 'cleftPalate' },
                { label: 'Others Specify', value: 'mouthAndGumsOtherSpecify' },
            ],
            width: {
                xs: 12,
                sm: 12,
                md: 6,
                lg: 6,
            },
            relevant: formValues => formValues.mouthAndGums === 'abnormal',
        },          
        {
            name: 'mouthAndGumsOtherSpecifyType',
            label: 'Other Specify',
            type: 'text',
            validate: yup.string().when(['mouthAndGums', 'mouthAndGumsAbnormalType'], {
              is: (mouthAndGums, abnormalTypes) =>
                mouthAndGums === 'abnormal' &&
                Array.isArray(abnormalTypes) &&
                abnormalTypes.includes('mouthAndGumsOtherSpecify'),
              then: yup.string().required('Please specify the other abnormal type'),
              otherwise: yup.string().notRequired(),
            }),
            width: {
              xs: 12,
              sm: 12,
              md: 6,
              lg: 6,
            },
            relevant: (formValues) =>
              formValues.mouthAndGums === 'abnormal' &&
              Array.isArray(formValues.mouthAndGumsAbnormalType) &&
              formValues.mouthAndGumsAbnormalType.includes('mouthAndGumsOtherSpecify'),
        },
        {
            name: 'mouthAndGumsRemarks',
            label: 'Remarks',
            type: 'text',
            validate: yup.string().required('Remarks are required'),
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
        },
    ],
    'Ears': [
        {
            name: 'ears',
            label: 'Ears',
            type: 'radio',
            options: [
                { label: 'Normal', value: 'normal' },
                { label: 'Abnormal', value: 'abnormal' },
            ],
            validate: yup.string().required('Ears status is required'),
            width: {
                xs: 12,
                sm: 12,
                md: 6,
                lg: 6,
            },
        },
        {
            name: 'earsAbnormalType',
            label: 'Ears abnormal type',
            type: 'checkbox',
            validate: yup.array()
                .of(yup.string())
                .when('ears', {
                is: 'abnormal',
                then: (schema) =>
                    schema
                    .min(1, 'Please select at least one abnormal type')
                    .required('Ears abnormal type is required'),
                otherwise: (schema) => schema.notRequired(),
                }),
            options: [
                { label: 'Others Specify', value: 'earsOtherSpecify' },
            ],
            width: {
                xs: 12,
                sm: 12,
                md: 6,
                lg: 6,
            },
            relevant: formValues => formValues.ears === 'abnormal',
        },          
        {
            name: 'earsOtherSpecifyType',
            label: 'Other Specify',
            type: 'text',
            validate: yup.string().when(['ears', 'earsAbnormalType'], {
              is: (ears, abnormalTypes) =>
                ears === 'abnormal' &&
                Array.isArray(abnormalTypes) &&
                abnormalTypes.includes('earsOtherSpecify'),
              then: yup.string().required('Please specify the other abnormal type'),
              otherwise: yup.string().notRequired(),
            }),
            width: {
              xs: 12,
              sm: 12,
              md: 6,
              lg: 6,
            },
            relevant: (formValues) =>
              formValues.ears === 'abnormal' &&
              Array.isArray(formValues.earsAbnormalType) &&
              formValues.earsAbnormalType.includes('earsOtherSpecify'),
          }
          ,
        {
            name: 'earsRemarks',
            label: 'Remarks',
            type: 'text',
            validate: yup.string().required('Remarks are required'),
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
        },
    ],
    'Arms and Legs': [
        {
            name: 'armsAndLegs',
            label: 'Arms and Legs',
            type: 'radio',
            options: [
                { label: 'Normal', value: 'normal' },
                { label: 'Abnormal', value: 'abnormal' },
            ],
            validate: yup.string().required('Arms and legs status is required'),
            width: {
                xs: 12,
                sm: 12,
                md: 6,
                lg: 6,
            },
        },
        {
            name: 'armsAndLegsNormalType',
            label: 'Arms and Legs normal type',
            type: 'checkbox',
            validate: yup.array()
                .of(yup.string())
                .when('armsAndLegs', {
                is: 'normal',
                then: (schema) =>
                    schema
                    .min(1, 'Please select at least one normal type')
                    .required('Arms and legs normal type is required'),
                otherwise: (schema) => schema.notRequired(),
                }),
            options: [
                { label: 'Normal Arms', value: 'normalArms' },
                { label: 'Normal Legs', value: 'normalLegs' },
                { label: 'Normal Back', value: 'normalBack' },
            ],
            width: {
                xs: 12,
                sm: 12,
                md: 6,
                lg: 6,
            },
            relevant: formValues => formValues.armsAndLegs === 'normal',
        },
        {
            name: 'armsAndLegsAbnormalType',
            label: 'Arms and Legs abnormal type',
            type: 'checkbox',
            validate: yup.array()
                .of(yup.string())
                .when('armsAndLegs', {
                is: 'abnormal',
                then: (schema) =>
                    schema
                    .min(1, 'Please select at least one abnormal type')
                    .required('Arms and legs abnormal type is required'),
                otherwise: (schema) => schema.notRequired(),
                }),
            options: [
                { label: 'Club foot', value: 'clubFoot' },
                { label: 'Congenital hip dislocation', value: 'congenitalHipDislocation' },
                { label: 'Jointed fingers or toes', value: 'jointedFingersOrToes' },
                { label: 'Extra fingers or toes', value: 'extraFingersOrToes' },
                { label: 'Others Specify', value: 'armsAndLegsOtherSpecify' },
            ],
            width: {
                xs: 12,
                sm: 12,
                md: 6,
                lg: 6,
            },
            relevant: formValues => formValues.armsAndLegs === 'abnormal',
        },          
        {
            name: 'armsAndLegsOtherSpecifyType',
            label: 'Other Specify',
            type: 'text',
            validate: yup.string().when(['armsAndLegs', 'armsAndLegsAbnormalType'], {
              is: (armsAndLegs, abnormalTypes) =>
                armsAndLegs === 'abnormal' &&
                Array.isArray(abnormalTypes) &&
                abnormalTypes.includes('armsAndLegsOtherSpecify'),
              then: yup.string().required('Please specify the other abnormal type'),
              otherwise: yup.string().notRequired(),
            }),
            width: {
              xs: 12,
              sm: 12,
              md: 6,
              lg: 6,
            },
            relevant: (formValues) =>
              formValues.armsAndLegs === 'abnormal' &&
              Array
              .isArray(formValues.armsAndLegsAbnormalType) &&
              formValues.armsAndLegsAbnormalType.includes('armsAndLegsOtherSpecify'),
        },
        {
            name: 'armsAndLegsRemarks',
            label: 'Remarks',
            type: 'text',
            validate: yup.string().required('Remarks are required'),
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
            },
        },
    ],

    'Muscle Tone': [
        {
            name: 'muscleTone',
            label: 'Muscle Tone',
            type: 'radio',
            options: [
                { label: 'Normal', value: 'normal' },
                { label: 'Abnormal', value: 'abnormal' },
            ],
            validate: yup.string().required('Muscle tone status is required'),
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        },
        {
            name: 'muscleToneAbnormalType',
            label: 'Muscle Tone abnormal type',
            type: 'checkbox',
            options: [
                { label: 'Floppiness', value: 'floppiness' },
                { label: 'Rigidity', value: 'rigidity' },
                { label: 'Other Specify', value: 'muscleToneOtherSpecify' },
            ],
            validate: yup.array().of(yup.string()).when('muscleTone', {
                is: 'abnormal',
                then: schema => schema.min(1).required('Select at least one abnormality'),
                otherwise: schema => schema.notRequired(),
            }),
            relevant: formValues => formValues.muscleTone === 'abnormal',
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        },
        {
            name: 'muscleToneOtherSpecifyType',
            label: 'Other Specify:',
            type: 'text',
            validate: yup.string().when(['muscleTone', 'muscleToneAbnormalType'], {
                is: (muscleTone, types) => muscleTone === 'abnormal' && types?.includes('muscleToneOtherSpecify'),
                then: yup.string().required('Please specify other muscle tone abnormality'),
                otherwise: yup.string().notRequired(),
            }),
            relevant: formValues =>
                formValues.muscleTone === 'abnormal' &&
                formValues.muscleToneAbnormalType?.includes('muscleToneOtherSpecify'),
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        },
        {
            name: 'muscleToneRemarks',
            label: 'Remarks',
            type: 'text',
            validate: yup.string().required('Remarks are required'),
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        },
    ],

    'Joints Movement': [
        {
            name: 'jointsMovement',
            label: 'Joints Movement',
            type: 'radio',
            options: [
                { label: 'Flexible', value: 'flexible' },
                { label: 'Abnormal', value: 'abnormal' },
            ],
            validate: yup.string().required('Joints movement is required'),
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        },
        {
            name: 'jointsMovementAbnormalType',
            label: 'Joints abnormal type',
            type: 'checkbox',
            options: [
                { label: 'Not Flexible', value: 'notFlexible' },
                { label: 'Other Specify', value: 'jointsMovementOtherSpecify' },
            ],
            validate: yup.array().of(yup.string()).when('jointsMovement', {
                is: 'abnormal',
                then: schema => schema.min(1).required('Specify joint abnormalities'),
                otherwise: schema => schema.notRequired(),
            }),
            relevant: formValues => formValues.jointsMovement === 'abnormal',
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        },
        {
            name: 'jointsMovementOtherSpecifyType',
            label: 'Other Specify:',
            type: 'text',
            validate: yup.string().when(['jointsMovement', 'jointsMovementAbnormalType'], {
                is: (joints, types) => joints === 'abnormal' && types?.includes('jointsMovementOtherSpecify'),
                then: yup.string().required('Specify the joint abnormality'),
                otherwise: yup.string().notRequired(),
            }),
            relevant: formValues =>
                formValues.jointsMovement === 'abnormal' &&
                formValues.jointsMovementAbnormalType?.includes('jointsMovementOtherSpecify'),
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        },
        {
            name: 'jointsMovementRemarks',
            label: 'Remarks',
            type: 'text',
            validate: yup.string().required('Remarks are required'),
            width: { xs: 12, sm: 12, md: 12, lg: 6 },
        },
    ],

    'Fingers and Toes': [
        {
            name: 'fingersAndToes',
            label: 'Fingers and Toes',
            type: 'radio',
            options: [
            { label: 'Normal 5 fingers and 5 toes', value: 'normal' },
            { label: 'Abnormal', value: 'abnormal' },
            ],
            validate: yup.string().required('Fingers and Toes status is required'),
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        },
        {
            name: 'fingersAndToesAbnormalType',
            label: 'Specify:',
            type: 'text',
            validate: yup.string().when('fingersAndToes', {
                is: 'abnormal',
                then: yup.string().required('Please specify the abnormality'),
                otherwise: yup.string().notRequired(),
                }),
            relevant: formValues => formValues.fingersAndToes === 'abnormal',
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        },
        {
            name: 'fingersAndToesRemarks',
            label: 'Remarks',
            type: 'text',
            validate: yup.string().required('Remarks are required'),
            width: { xs: 12, sm: 12, md: 12, lg: 6 },
        },
    ],
    'Arms & Shoulders': [
        {
            name: 'armsAndShoulders',
            label: 'Arms & Shoulders',
            type: 'radio',
            options: [
            { label: 'Normal', value: 'normal' },
            { label: 'Abnormal', value: 'abnormal' },
            ],
            validate: yup.string().required('Arms & Shoulders status is required'),
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        },
        {
            name: 'armsAndShouldersAbnormalType',
            label: 'Specify:',
            type: 'text',
            validate: yup.string().when('armsAndShoulders', {
                is: 'abnormal',
                then: yup.string().required('Please specify the abnormality'),
                otherwise: yup.string().notRequired(),
                }),
            relevant: formValues => formValues.armsAndShoulders === 'abnormal',
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        },
        {
            name: 'armsAndShouldersRemarks',
            label: 'Remarks',
            type: 'text',
            validate: yup.string().required('Remarks are required'),
            width: { xs: 12, sm: 12, md: 12, lg: 6 },
        },
    ],
    'Spine/Neck/Back': [
        {
            name: 'spineNeckBack',
            label: 'Spine/Neck/Back',
            type: 'radio',
            options: [
            { label: 'Normal', value: 'normal' },
            { label: 'Abnormal', value: 'abnormal' },
            ],
            validate: yup.string().required('Spine/Neck/Back status is required'),
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        },
        {
            name: 'spineNeckBackAbnormalType',
            label: 'Abnormal Details',
            type: 'checkbox',
            options: [
            { label: 'Any Swellings', value: 'swellings' },
            { label: 'Protrusions', value: 'protrusions' },
            { label: 'Sores or Marks along the spine', value: 'soresOrMarks' },
            { label: 'Others Specify', value: 'spineNeckBackOtherSpecify' },
            ],
            validate: yup.array().of(yup.string()).when('spineNeckBack', {
                is: 'abnormal',
                then: schema => schema.min(1).required('Please select at least one abnormal type'),
                otherwise: schema => schema.notRequired(),
                }),
            relevant: formValues => formValues.spineNeckBack === 'abnormal',
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        },
        {
            name: 'spineNeckBackOtherSpecifyType',
            label: 'Other Specify',
            type: 'text',
            validate: yup.string().when(['spineNeckBack', 'spineNeckBackAbnormalType'], {
                is: (val, types) => val === 'abnormal' && types?.includes('spineNeckBackOtherSpecify'),
                then: yup.string().required('Please specify other abnormality'),
                otherwise: yup.string().notRequired(),
                }),
            relevant: formValues =>
            formValues.spineNeckBack === 'abnormal' &&
            formValues.spineNeckBackAbnormalType?.includes('spineNeckBackOtherSpecify'),
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        },
        {
            name: 'spineNeckBackRemarks',
            label: 'Remarks',
            type: 'text',
            validate: yup.string().required('Remarks are required'),
            width: { xs: 12, sm: 12, md: 12, lg: 6 },
        },
    ],
    'Body Movement': [
        {
            name: 'bodyMovement',
            label: 'Body Movement',
            type: 'radio',
            options: [
            { label: 'Normal', value: 'normal' },
            { label: 'Abnormal', value: 'abnormal' },
            ],
            validate: yup.string().required('Body movement is required'),
            width: { xs: 12, sm: 12, md: 6, lg: 6},
        },
        {
            name: 'bodyMovementAbnormalType',
            label: 'Abnormal Type',
            type: 'checkbox',
            options: [
            { label: 'Baby becomes floppy when lying in certain position', value: 'floppyPosition' },
            { label: 'Cerebral palsy?', value: 'cerebralPalsy' },
            { label: 'Others Specify', value: 'bodyMovementOtherSpecify' },
            ],
            validate: yup.array()
                .of(yup.string())
                .when('bodyMovement', {
                    is: 'abnormal',
                    then: (schema) =>
                    schema
                        .min(1, 'Select at least one abnormal type')
                        .required('Abnormal type is required'),
                    otherwise: (schema) => schema.notRequired(),
                }),
            relevant: formValues => formValues.bodyMovement === 'abnormal',
            width: { xs: 12, sm: 12, md: 6, lg: 6},
        },
        {
            name: 'bodyMovementOtherSpecifyType',
            label: 'Other Specify',
            type: 'text',
            validate: yup.string().when(['bodyMovement', 'bodyMovementAbnormalType'], {
            is: (val, types) =>
                val === 'abnormal' &&
                Array.isArray(types) &&
                types.includes('bodyMovementOtherSpecify'),
                then: yup.string().required('Please specify the other abnormal type'),
                otherwise: yup.string().notRequired(),
            }),
            relevant: formValues => formValues.bodyMovement === 'abnormal' &&
                Array.isArray(formValues.bodyMovementAbnormalType) &&
                formValues.bodyMovementAbnormalType.includes('bodyMovementOtherSpecify'),
            width: { xs: 12, sm: 12, md: 6, lg: 6},
        },
        {
            name: 'bodyMovementRemarks',
            label: 'Remarks',
            type: 'text',
            validate: yup.string().required('Remarks are required'),
            width: { xs: 12, sm: 12, md: 12, lg: 6 },
        },
    ],
    'Abdominal Wall': [
        {
            name: 'abdominalWall',
            label: 'Abdominal Wall',
            type: 'radio',
            options: [
            { label: 'Normal', value: 'normal' },
            { label: 'Abnormal', value: 'abnormal' },
            ],
            validate: yup.string().required('Abdominal wall status is required'),
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        },
        {
            name: 'abdominalWallAbnormalType',
            label: 'Specify',
            type: 'text',
            validate: yup.string().when('abdominalWall', {
                is: 'abnormal',
                then: yup.string().required('Please specify abdominal wall abnormality'),
                otherwise: yup.string().notRequired(),
                }),
            relevant: formValues => formValues.abdominalWall === 'abnormal',
            width: { xs: 12, sm: 12, md: 6, lg: 6},
        },
        {
            name: 'abdominalWallRemarks',
            label: 'Remarks',
            type: 'text',
            validate: yup.string().required('Remarks are required'),
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        },
    ],
    'Genitalia': [
        {
            name: 'genitalia',
            label: 'Genitalia',
            type: 'radio',
            options: [
            { label: 'Normal', value: 'normal' },
            { label: 'Abnormal', value: 'abnormal' },
            ],
            validate: yup.string().required('Genitalia status is required'),
            width: { xs: 12, sm: 6 },
        },
        {
            name: 'genitaliaRemarks',
            label: 'Remarks',
            type: 'text',
            validate: yup.string().required('Remarks are required'),
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        }
    ],
    'Anus': [
        {
            name: 'anus',
            label: 'Anus',
            type: 'radio',
            options: [
            { label: 'Perforate (Normal)', value: 'normal' },
            { label: 'Imperforate (Abnormal)', value: 'abnormal' },
            ],
            validate: yup.string().required('Anus status is required'),
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        },
        {
            name: 'anusRemarks',
            label: 'Remarks',
            type: 'text',
            validate: yup.string().required('Remarks are required'),
            width: { xs: 12, sm: 12, md: 6, lg: 6 },
        }
    ],


}

export default congenitalAbnormalitiesFields;