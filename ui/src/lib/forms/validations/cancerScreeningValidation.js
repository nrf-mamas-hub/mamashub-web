import * as yup from "yup";

const cancerScreeningValidationSchema = yup.object().shape({
  // Cervical Cancer Screening Validations
  cervixHpvTest: yup.string().required("HPV test result is required"),
  cervixHpvScreeningDate: yup.date().when("cervixHpvTest", {
    is: "Yes",
    then: yup.date().required("HPV screening date is required"),
    otherwise: yup.date(),
  }),
  cervixHpvResult: yup.string().when("cervixHpvTest", {
    is: "Yes",
    then: yup.string().required("HPV result is required"),
    otherwise: yup.string(),
  }),
  cervixHpvTreatment: yup.array().when(["cervixHpvResult"], {
    is: (result) => result === "Positive" || result === "Suspicious for Cancer",
    then: yup.array(),
    otherwise: yup.array(),
  }),

  cervixViaTest: yup.string().required("VIA test result is required"),
  cervixViaScreeningDate: yup.date().when("cervixViaTest", {
    is: "Yes",
    then: yup.date().required("VIA screening date is required"),
    otherwise: yup.date(),
  }),
  cervixViaResult: yup.string().when("cervixViaTest", {
    is: "Yes",
    then: yup.string().required("VIA result is required"),
    otherwise: yup.string(),
  }),
  cervixViaTreatment: yup.array().when(["cervixViaResult"], {
    is: (result) => result === "Positive" || result === "Suspicious for Cancer",
    then: yup.array(),
    otherwise: yup.array(),
  }),

  cervixViaViliTest: yup.string().required("VIA/VILI test result is required"),
  cervixViaViliScreeningDate: yup.date().when("cervixViaViliTest", {
    is: "Yes",
    then: yup.date().required("VIA/VILI screening date is required"),
    otherwise: yup.date(),
  }),
  cervixViaViliResult: yup.string().when("cervixViaViliTest", {
    is: "Yes",
    then: yup.string().required("VIA/VILI result is required"),
    otherwise: yup.string(),
  }),
  cervixViaViliTreatment: yup.array().when(["cervixViaViliResult"], {
    is: (result) => result === "Positive" || result === "Suspicious for Cancer",
    then: yup.array(),
    otherwise: yup.array(),
  }),

  cervixPapSmearTest: yup.string().required("Pap smear test result is required"),
  cervixPapSmearScreeningDate: yup.date().when("cervixPapSmearTest", {
    is: "Yes",
    then: yup.date().required("Pap smear screening date is required"),
    otherwise: yup.date(),
  }),
  cervixPapSmearResult: yup.string().when("cervixPapSmearTest", {
    is: "Yes",
    then: yup.string().required("Pap smear result is required"),
    otherwise: yup.string(),
  }),
  cervixPapSmearTreatment: yup.array().when(["cervixPapSmearResult"], {
    is: (result) => result === "Ascus Or Greater" || result === "Suspicious for Cancer",
    then: yup.array(),
    otherwise: yup.array(),
  }),

  // Breast Cancer Screening Validations
  breastCbeTest: yup.string().required("CBE test result is required"),
  breastCbeScreeningDate: yup.date().when("breastCbeTest", {
    is: "Yes",
    then: yup.date().required("CBE screening date is required"),
    otherwise: yup.date(),
  }),
  breastCbeResult: yup.string().when("breastCbeTest", {
    is: "Yes",
    then: yup.string().required("CBE result is required"),
    otherwise: yup.string(),
  }),
  breastCbeTreatment: yup.array().when(["breastCbeResult"], {
    is: (result) => result === "Benign Lump" || result === "Suspicious Lump",
    then: yup.array(),
    otherwise: yup.array(),
  }),
  breastCbeTreatmentOthersSpecify: yup.string().when(["breastCbeTreatment"], {
    is: (treatment) => Array.isArray(treatment) && treatment.includes("Others"),
    then: yup.string().required("Please specify other treatment"),
    otherwise: yup.string(),
  }),

  breastUltrasoundTest: yup.string().when(["breastCbeResult"], {
    is: (result) => result === "Benign Lump" || result === "Suspicious Lump",
    then: yup.string().required("Ultrasound test is required"),
    otherwise: yup.string(),
  }),
  breastUltrasoundScreeningDate: yup.date().when("breastUltrasoundTest", {
    is: "Yes",
    then: yup.date().required("Ultrasound screening date is required"),
    otherwise: yup.date(),
  }),
  breastUltrasoundResult: yup.string().when("breastUltrasoundTest", {
    is: "Yes",
    then: yup.string().required("Ultrasound result is required"),
    otherwise: yup.string(),
  }),
  breastUltrasoundTreatmentDiagnosisTreatmentIndicate: yup.string().when("breastUltrasoundResult", {
    is: "Abnormal",
    then: yup.string().required("Diagnosis/Treatment indication is required"),
    otherwise: yup.string(),
  }),
  breastUltrasoundTreatmentReferral: yup.array().when("breastUltrasoundResult", {
    is: "Abnormal",
    then: yup.array(),
    otherwise: yup.array(),
  }),
});

export default cancerScreeningValidationSchema;