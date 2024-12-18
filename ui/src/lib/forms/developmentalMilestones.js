import * as yup from 'yup';

const formData = {
    'Social smile/follows a colourful object dangled before their eyes(0-2 months)': [
        {
            name: 'socialSmileOrFollowsDangledObjectAgeAchieved',
            label: 'Age',
            type: 'text',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
              validate: yup
              .number().required('Age is required')
              .typeError('Age should be a number'),
        },
        {
            name: 'socialSmileMilestoneAchieved',
            label: 'Milestone achieved',
            type: 'radio',
            validate: yup.string().required('Milestone achieved is required'),
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
            options: 
            [{
                label:'Within time',
                value: 'Within time',
            },
            {
                label:'Delayed',
                value: 'Delayed',
            },
         ],
        },
    ],
    'Holds the head upright / follows the object or face with their eyes / turns thehead or responds in any other way tosound / smiles when you speak (2-4 months)':[
        {
            name: 'holdsHeadUprightAgeAchieved',
            label: 'Age',
            type: 'text',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
              validate: yup
              .number().required('Age is required')
              .typeError('Age should be a number'),
        },
        {
            name: 'holdsHeadUprightMilestoneAchieved',
            label: 'Milestone achieved',
            type: 'radio',
            validate: yup.string().required('Milestone achieved is required'),
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
            options: 
            [{
                label:'Within time',
                value: 'Within time',
            },
            {
                label:'Delayed',
                value: 'Delayed',
            },
         ],
        },
    ],
    'Rolls over / reaches for and grasps objects with hand / takes objects to hermouth / babbles (makes sounds) (6-8 months)':[
        {
            name: 'rollsOverAgeAchieved',
            label: 'Age',
            type: 'text',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
              validate: yup
              .number().required('Age is required')
              .typeError('Age should be a number'),
        },
        {
            name: 'rollsOverMilestoneAchieved',
            label: 'Milestone achieved',
            type: 'radio',
            validate: yup.string().required('Milestone achieved is required'),
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
            options: 
            [{
                label:'Within time',
                value: 'Within time',
            },
            {
                label:'Delayed',
                value: 'Delayed',
            },
         ],
        },
    ],
    'Sits without support / moves object from one hand to the other/ repeats syllables(bababa, mamama) (8-10 months)':[
        {
            name: 'sitsWithoutSupportAgeAchieved',
            label: 'Age',
            type: 'text',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
              validate: yup
              .number().required('Age is required')
              .typeError('Age should be a number'),
        },
        {
            name: 'sitsWithoutSupportMilestoneAchieved',
            label: 'Milestone achieved',
            type: 'radio',
            validate: yup.string().required('Milestone achieved is required'),
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
            options: [
                {
                label:'Within time',
                value: 'Within time',
            },
            {
                label:'Delayed',
                value: 'Delayed',
            },
         ],
        }
    ],
    'Takes steps with support / picks up small object or string with 2 fingers / says 2-3words / imitates simple gestures (clapshands, bye) (10-12 months)':[
        {
            name: 'takesStepsWithoutSupportAgeAchieved',
            label: 'Age',
            type: 'text',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
              validate: yup
              .number().required('Age is required')
              .typeError('Age should be a number'),
        },
        {
            name: 'takesStepsWithoutSupportMilestoneAchieved',
            label: 'Milestone achieved',
            type: 'radio',
            validate: yup.string().required('Milestone achieved is required'),
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
            options: 
            [{
                label:'Within time',
                value: 'Within time',
            },
            {
                label:'Delayed',
                value: 'Delayed',
            },
         ],
        }
    ],
    'Walks without support / drinks from a cup / says 7-10 words / points to somebody parts on request (12-14 months)':[
        {
            name: 'walksWithoutSupportAgeAchieved',
            label: 'Age',
            type: 'text',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
              validate: yup
              .number().required('Age is required')
              .typeError('Age should be a number'),
        },
        {
            name: 'walksWithoutSupportMilestoneAchieved',
            label: 'Milestone achieved',
            type: 'radio',
            validate: yup.string().required('Milestone achieved is required'),
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
            options: 
            [{
                label:'Within time',
                value: 'Within time',
            },
            {
                label:'Delayed',
                value: 'Delayed',
            },
         ],
        }
    ],
    'Kicks a ball / builds tower with 3 blocks or small boxes / points at pictures on request / speaks in short sentences (14-16 months)':[
        {
            name: 'kicksABallAgeAchieved',
            label: 'Age',
            type: 'text',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
              validate: yup
              .number().required('Age is required')
              .typeError('Age should be a number'),
        },
        {
            name: 'kicksABallMilestoneAchieved',
            label: 'Milestone achieved',
            type: 'radio',
            validate: yup.string().required('Milestone achieved is required'),
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
            options: 
            [{
                label:'Within time',
                value: 'Within time',
            },
            {
                label:'Delayed',
                value: 'Delayed',
            },
         ],
        },
    ],
    'Jumps/ undresses and dresses themselves / says name, tells short story/ interested in playing with other children (16-18 months)':[
        {
            name: 'jumpsOrDressesThemselvesAgeAchieved',
            label: 'Age',
            type: 'text',
            required: true,
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
              validate: yup
              .number().required('Age is required')
              .typeError('Age should be a number'),
        },
        {
            name: 'jumpsOrDressesThemselvesMilestoneAchieved',
            label: 'Milestone achieved',
            type: 'radio',
            validate: yup.string().required('Milestone achieved is required'),
            width: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
              },
            options: 
            [{
                label:'Within time',
                value: 'Within time',
            },
            {
                label:'Delayed',
                value: 'Delayed',
            },
         ],
        }
    ]
}

export default formData;