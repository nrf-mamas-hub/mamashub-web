import * as yup from "yup";

const antenatalProfileValidationSchema = yup.object().shape({
  hbTestHbTestDone: yup.string().required("Hb Test is required"),
  hbTestHbTestReading: yup.string().when("hbTestHbTestDone", {
    is: "Yes",
    then: yup.string().required("If yes, specify reading is required"),
    otherwise: yup.string(),
  }),
  bloodGroupTest: yup.string().required("Blood Group Test is required"),
  bloodGroup: yup.string().when("bloodGroupTest", {
    is: "Yes",
    then: yup.string().required("Blood Group is required"),
    otherwise: yup.string(),
  }),
  rhTest: yup.string().required("Rhesus Test is required"),
  rhesusFactor: yup.string().when("rhTest", {
    is: "Yes",
    then: yup.string().required("If yes, specify rhesus factor is required"),
    otherwise: yup.string(),
  }),
  bloodRBSTest: yup.string().required("Blood RBS Test is required"),
  bloodRBSTestResults: yup.number().when("bloodRBSTest", {
    is: "Yes",
    then: yup.number().required("If yes, RBS reading is required"),
    otherwise: yup.number(),
  }),
  urinalysis: yup.string().required("Urinalysis Test is required"),
  urinalysisTestResults: yup.string().when("urinalysis", {
    is: "Yes",
    then: yup.string().required("If yes, test results are required"),
    otherwise: yup.string(),
  }),
  tbScreening: yup.string().required("TB Screening is required"),
  tbScreeningResults: yup.string().when("tbScreening", {
    is: "Yes",
    then: yup.string().required("If yes, TB results are required"),
    otherwise: yup.string(),
  }),
  tbDiagnosis: yup.string().when(["tbScreeningResults", "tbScreening"], {
    is: (results, screening) => results === "Positive" && screening === "Yes",
    then: yup
      .string()
      .required("If positive, send for TB diagnosis is required"),
    otherwise: yup.string(),
  }),
  ipt: yup.string().when("tbScreeningResults", {
    is: "Negative",
    then: yup.string().required("If negative, was IPT given is required"),
    otherwise: yup.string(),
  }),
  iptDate: yup.date().when("ipt", {
    is: "Yes",
    then: yup.date().required("IPT date given is required"),
    otherwise: yup.date(),
  }),
  iptNextVisit: yup.date().required("Next IPT visit is required"),
  multipleBabies: yup.string().required("Multiple Babies is required"),
  multipleBabiesNumber: yup.number().when("multipleBabies", {
    is: "Yes",
    then: yup.number().required("If yes, input number is required"),
    otherwise: yup.number(),
  }),
  firstObstreticUltrasound: yup
    .string()
    .required("1st Obstetric Ultrasound is required"),
  firstObstreticUltrasoundDate: yup.date().when("firstObstreticUltrasound", {
    is: "Yes",
    then: yup.date().required("Date performed is required"),
    otherwise: yup.date(),
  }),
  gestationByFirstObstreticUltrasound: yup
    .number()
    .when("firstObstreticUltrasound", {
      is: "Yes",
      then: yup
        .number()
        .required("Gestation by 1st Obstetric Ultrasound is required"),
      otherwise: yup.number(),
    }),
  secondObstreticUltrasound: yup
    .string()
    .required("2nd Obstetric Ultrasound is required"),
  secondObstreticUltrasoundDate: yup.date().when("secondObstreticUltrasound", {
    is: "Yes",
    then: yup.date().required("Date performed is required"),
    otherwise: yup.date(),
  }),
  gestationBySecondObstreticUltrasound: yup
    .number()
    .when("secondObstreticUltrasound", {
      is: "Yes",
      then: yup
        .number()
        .required("Gestation by 2nd Obstetric Ultrasound is required"),
      otherwise: yup.number(),
    }),
  hivStatusBeforeFirstAnc: yup
    .string()
    .required("HIV Status before 1st ANC visit is required"),
  artEligibility: yup.string(),
  onArvBeforeFirstAnc: yup.string().when("hivStatusBeforeFirstAnc", {
    is: "KP",
    then: yup.string().required("On ARV before 1st ANC visit is required"),
    otherwise: yup.string(),
  }),
  startedHaartInAnc: yup.string().when("hivStatusBeforeFirstAnc", {
    is: "KP",
    then: yup.string().required("Started HAART in ANC is required"),
    otherwise: yup.string(),
  }),
  clotrimoxazoleGiven: yup.string().when("hivStatusBeforeFirstAnc", {
    is: "KP",
    then: yup.string().required("Clotrimoxazole given is required"),
    otherwise: yup.string(),
  }),
  hivTested: yup.string().required("HIV Test is required"),
  hivTestDate: yup.date().when("hivTested", {
    is: "Yes",
    then: yup.date().required("If yes, Date of Test is required"),
    otherwise: yup.date(),
  }),
  nextDateOfHivTestNR: yup.date().when("hivTested", {
    is: "Yes",
    then: yup.date(),
    otherwise: yup.date(),
  }),
  hivStatusOfMother: yup.string().required("HIV Status of Mother is required"),
  hivTestDateOfPartner: yup.date().when("hivStatusOfMother", {
    is: "R",
    then: yup.date().required("If yes, Date of Test is required"),
    otherwise: yup.date(),
  }),
  syphilisTested: yup.string().required("Syphilis Test is required"),
  syphilisTestDate: yup.date().when("syphilisTested", {
    is: "Yes",
    then: yup.date().required("If yes, Date of Test is required"),
    otherwise: yup.date(),
  }),
  syphillisStatusOfMother: yup.string().when("syphilisTested", {
    is: "Yes",
    then: yup.string().required("Syphilis Status of Mother is required"),
    otherwise: yup.string(),
  }),
  hepatitisBTested: yup.string().required("Hepatitis B Test is required"),
  hepatitisBTestDate: yup.date().when("hepatitisBTested", {
    is: "Yes",
    then: yup.date().required("If yes, Date of Test is required"),
    otherwise: yup.date(),
  }),
  hepatitisBStatusOfMother: yup.string().when("hepatitisBTested", {
    is: "Yes",
    then: yup.string().required("Hepatitis B Status of Mother is required"),
    otherwise: yup.string(),
  }),
  coupleCounsellingAndTesting: yup
    .string()
    .required("Couple HIV Counselling and Testing is required"),
  partnerHivStatus2: yup.string().required("Partner HIV Status is required"),
  partnerReferredForHivCare: yup.string().when("partnerHivStatus2", {
    is: "Reactive",
    then: yup
      .string()
      .required(
        "If Reactive, Was the Partner Referred for HIV Care? is required"
      ),
    otherwise: yup.string(),
  }),
  referralDate: yup.date().required("Referral Date is required"),
});

export default antenatalProfileValidationSchema;
