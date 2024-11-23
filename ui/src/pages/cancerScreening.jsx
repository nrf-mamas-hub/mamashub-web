import {
  Container,
  Stack,
  Button,
  Snackbar,
  Typography,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../lib/cookie";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CurrentPatient from "../components/CurrentPatient";
import { useFormik } from "formik";
import Preview from "../components/Preview";
import FormFields from "../components/FormFields";
import cancerScreeningFields from "../lib/forms/cancerScreening";
import { createEncounter, FhirApi } from "./../lib/api";
import cancerScreeningValidationSchema from "../lib/forms/validations/cancerScreeningValidation";

export default function CancerScreening() {
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [visit, setVisit] = useState();
  let [message, setMessage] = useState(false);
  let isMobile = useMediaQuery("(max-width:600px)");
  const [value, setValue] = useState("1");
  const [inputData, setInputData] = useState({});
  const [preview, setPreview] = useState(false);

  const fieldValues = Object.values(cancerScreeningFields).flat();
  console.log("cancerScreeningFields:", cancerScreeningFields);

  const initialValues = Object.assign(
      {},
      ...fieldValues.map((item) => ({ [item.name]: "" }))
  );

  const formik = useFormik({
      initialValues: {
          ...initialValues,
      },
      validationSchema: cancerScreeningValidationSchema,
      onSubmit: (values) => {
          console.log(values);
          setPreview(true);
          setInputData(values);
      },
  });

  const prompt = (text) => {
      setMessage(text);
      setOpen(true);
      setTimeout(() => {
          setOpen(false);
      }, 4000);
      return;
  };

  let saveCancerScreening = async (values) => {
      //get current patient
      let patient = visit?.id;
      if (!patient) {
          prompt(
              "No patient visit not been initiated. To start a visit, Select a client from the Client list"
          );
          return;
      }

      try {
          //create encounter
          let encounter = await createEncounter(patient, "CANCER_SCREENING");

          //save observations
          let res = await (
              await FhirApi({
                  url: `/crud/observations`,
                  method: "POST",
                  data: JSON.stringify({
                      patientId: patient,
                      encounterId: encounter.id,
                      observations: values,
                  })
              })
          ).data;

          if (res.status === "success") {
              prompt("Cancer Screening saved successfully");
              return;
          } else {
              prompt(res.error);
              return;
          }
      } catch (error) {
          console.error(error);
          prompt("An error occurred while saving the cancer screening data");
          return;
      }
  };

  const handleChange = ( newValue) => {
      setValue(newValue);
  };

  // Authentication check effect
  useEffect(() => {
      if (getCookie("token")) {
          return;
      } else {
          window.localStorage.setItem("next_page", "/cancer-screening");
          navigate("/login");
          return;
      }
  }, []);

  useEffect(() => {
      let visit = window.localStorage.getItem("currentPatient");
      if (!visit) {
          prompt(
              "No patient visit not been initiated. To start a visit, Select a client from the Client list"
          );
          return;
      }
      setVisit(JSON.parse(visit));
      return;
  }, []);

  return (
      <>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Container sx={{ border: "1px white dashed" }}>
                  <Snackbar
                      anchorOrigin={{ vertical: "top", horizontal: "center" }}
                      open={open}
                      message={message}
                      key={"loginAlert"}
                  />
                  {visit && <CurrentPatient data={visit} />}
                  {preview ? (
                      <Preview
                          title="Cancer Screening Preview"
                          format={cancerScreeningFields}
                          data={{ ...inputData }}
                          close={() => setPreview(false)}
                          submit={saveCancerScreening}
                      />
                  ) : (
                      <form onSubmit={formik.handleSubmit}>
                          <TabContext value={value}>
                              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                                  <TabList
                                      value={value}
                                      onChange={handleChange}
                                      variant="scrollable"
                                      scrollButtons="auto"
                                  >
                                      <Tab label="REPRODUCTIVE ORGANS CANCER SCREENING" value="1" />
                                  </TabList>
                              </Box>

                              <TabPanel value="1">
                                  <FormFields formData={cancerScreeningFields} formik={formik} />
                                  <p></p>
                                  <Divider />
                                  <p></p>
                                  <Stack direction="row" spacing={2} alignContent="right">
                                      {!isMobile && (
                                          <Typography sx={{ minWidth: "80%" }}></Typography>
                                      )}
                                      <Button
                                          variant="contained"
                                          disableElevation
                                          sx={{ backgroundColor: "gray" }}
                                          onClick={() => {
                                              //Reset form on cancel
                                              formik.resetForm();
                                          }}
                                      >
                                          Cancel
                                      </Button>
                                      <Button
                                          variant="contained"
                                          type="submit"
                                          disableElevation
                                          sx={{ backgroundColor: "#632165" }}
                                      >
                                          Preview
                                      </Button>
                                  </Stack>
                                  <p></p>
                              </TabPanel>
                          </TabContext>
                      </form>
                  )}
              </Container>
          </LocalizationProvider>
      </>
  );
}