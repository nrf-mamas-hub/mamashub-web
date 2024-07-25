import * as yup from "yup";

const physicalExaminationValidationSchema = yup.object().shape({
  // General Examination
  surgicalOperation: yup.string().required("Surgical Operation is required"),
  surgicalOperationDetails: yup.string().when("surgicalOperation", {
    is: "Abnormal",
    then: yup.string().required("If abnormal, please specify is required"),
    otherwise: yup.string(),
  }),

  // Blood Pressure
  bpSystolic: yup.number()
    .required("Systolic BP (mmHg) is required")
    .typeError("Systolic BP must be a number"),
  bpDiastolic: yup.number()
    .required("Diastolic BP (mmHg) is required")
    .typeError("Diastolic BP must be a number"),
  pulse: yup.number().required("Pulse Rate is required"),
  temperature: yup.number().required("Temperature is required"),

  // CVs
  cvs: yup.string().required("CVs is required"),
  abnormalCVsSpecify: yup.string().when("cvs", {
    is: "Abnormal",
    then: yup.string().required("If abnormal, please specify is required"),
    otherwise: yup.string(),
  }),

  // Respiration
  respiration: yup.string().required("Respiration is required"),
  respirationAbnormalSpecify: yup.string().when("respiration", {
    is: "Abnormal",
    then: yup.string().required("If abnormal, please specify is required"),
    otherwise: yup.string(),
  }),

  // Breast Exam
  breastExam: yup.string().required("Breast Exam is required"),
  breastExamFindings: yup.string().when("breastExam", {
    is: "Normal",
    then: yup.string().required("If normal, record findings is required"),
    otherwise: yup.string(),
  }),
  breastExamAbnormalSpecify: yup.string().when("breastExam", {
    is: "Abnormal",
    then: yup.string().required("If abnormal, specify is required"),
    otherwise: yup.string(),
  }),

  // Weight Monitoring
  mothersWeight: yup.number()
    .required("Mother's Weight is required")
    .typeError("Mother's Weight must be a number"),
  gestation: yup.number()
    .required("Gestation in Weeks is required")
    .typeError("Gestation in Weeks must be a number"),

  // Abdominal Examinations
  inspectionDone: yup.string().required("Inspection Done is required"),
  inspectionDoneSpecify: yup.string().when("inspectionDone", {
    is: "Yes",
    then: yup.string().required("If yes, please specify is required"),
    otherwise: yup.string(),
  }),
  palpationDone: yup.string().required("Palpation Done is required"),
  palpationDoneSpecify: yup.string().when("palpationDone", {
    is: "Yes",
    then: yup.string().required("If yes, please specify is required"),
    otherwise: yup.string(),
  }),
  auscultationDone: yup.string().required("Auscultation Done is required"),
  auscalationDoneSpecify: yup.string().when("auscultationDone", {
    is: "Yes",
    then: yup.string().required("If yes, please specify is required"),
    otherwise: yup.string(),
  }),

  // External Genitalia Examination
  genitaliaInspectionDone: yup.string().required("Inspection Done is required"),
  externalGenitaliaInspectionDoneSpecify: yup.string().when("genitaliaInspectionDone", {
    is: "Yes",
    then: yup.string().required("If yes, please specify is required"),
    otherwise: yup.string(),
  }),
  genitaliaPalpationDone: yup.string().required("Palpation Done is required"),
  externalGenitaliaPalpationDone: yup.string().when("genitaliaPalpationDone", {
    is: "Yes",
    then: yup.string().required("If yes, please specify is required"),
    otherwise: yup.string(),
  }),
  dischargePresent: yup.string().required("Discharge Present is required"),
  dischargePresentSpecify: yup.string().when("dischargePresent", {
    is: "Yes",
    then: yup.string().required("If yes, please specify is required"),
    otherwise: yup.string(),
  }),
  genitalUlcerPresent: yup.string().required("Genital Ulcer Present is required"),
  genitalUlcerPresentSpecify: yup.string().when("genitalUlcerPresent", {
    is: "Yes",
    then: yup.string().required("If yes, please specify is required"),
    otherwise: yup.string(),
  }),
  fgmDone: yup.string().required("FGM Done is required"),
  fgmComplications: yup.array().when("fgmDone", {
    is: "Yes",
    then: yup.array().min(1, "If FGM Done, select at least one complication is required"),
    otherwise: yup.array(),
  }),
});

export default physicalExaminationValidationSchema;
