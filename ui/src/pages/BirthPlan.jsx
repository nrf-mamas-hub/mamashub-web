import {
  Container,
  FormGroup,
  Checkbox,
  TextField,
  Stack,
  Button,
  Grid,
  Snackbar,
  Typography,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getCookie } from "../lib/cookie";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { createEncounter, apiHost, FhirApi } from "../lib/api";
import CurrentPatient from "../components/CurrentPatient";
import { useFormik } from "formik";
import * as yup from "yup";
import birthPlan from "../lib/forms/birthPlan";
import Preview from "../components/Preview";
import FormFields from "../components/FormFields";

export default function BirthPlan({ userData }) {
  let [visit, setVisit] = useState();
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [data, setData] = useState({});
  let [message, setMessage] = useState(false);
  let isMobile = useMediaQuery("(max-width:600px)");

  const [value, setValue] = useState("1");
  const [inputData, setInputData] = useState({});
  const [preview, setPreview] = useState(false);

  const fieldValues = Object.values(birthPlan).flat();
  const validationFields = fieldValues
    .filter((item) => item.validate)
    .map((item) => ({
      [item.name]: item.validate,
    }));

  const validationSchema = yup.object({
    ...Object.assign({}, ...validationFields),
  });

  const initialValues = Object.assign(
    {},
    ...fieldValues.map((item) => ({ [item.name]: "" }))
  );

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      facilityName: userData.facilityName,
      facilityNumber: userData.kmhflCode,
    },
    validationSchema: validationSchema,
    // submit form
    onSubmit: (values) => {
      console.log(values);
      setPreview(true);
      setInputData(values);
    },
  });

  function prompt(text) {
    setMessage(text);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 4000);
    return;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    return;
  };

  let saveBirthPlan = async (values) => {
    //get current patient
    let patient = visit.id;
    if (!patient) {
      prompt(
        "No patient visit not been initiated. To start a visit, Select a patient in the Patient's list"
      );
      return;
    }

    //create encounter
    let encounter = await createEncounter(patient, "BIRTH-PLAN");
    console.log(encounter);

    //save observations
    //Create and Post Observations
    let res = await (
      await FhirApi({
        url: `/crud/observations`,
        method: "POST",
        data: JSON.stringify({
          patientId: patient,
          encounterId: encounter,
          observations: values,
        }),
      })
    ).data;
    console.log(res);

    if (res.status === "success") {
      prompt("Birth Plan saved successfully");
      return;
    } else {
      prompt(res.error);
      return;
    }
  };

  useEffect(() => {
    let visit = window.localStorage.getItem("currentPatient");
    if (!visit) {
      prompt(
        "No patient visit not been initiated. To start a visit, Select a patient in the Patient's list"
      );
      setTimeout(() => {
        navigate("/patients");
      }, 3000);
      return;
    }
    setVisit(JSON.parse(visit));
    return;
  }, []);
  useEffect(() => {
    if (getCookie("token")) {
      return;
    } else {
      window.localStorage.setItem("next_page", "/patient-profile");
      navigate("/login");
      return;
    }
  }, []);
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container sx={{ border: "1px white dashed" }}>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={open}
            onClose={""}
            message={message}
            key={"loginAlert"}
          />
          {visit && <CurrentPatient data={visit} />}
          {preview ? (
            <Preview
              title="Birth Plan Preview"
              format={birthPlan}
              data={{ ...inputData }}
              close={() => setPreview(false)}
              submit={saveBirthPlan}
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
                    <Tab label="Birth Plan" value="1" />
                  </TabList>
                </Box>

                <TabPanel value="1">
                  <FormFields formData={birthPlan} formik={formik} />

                  <Stack direction="row" spacing={2} alignContent="right">
                    {!isMobile && (
                      <Typography sx={{ minWidth: "80%" }}></Typography>
                    )}
                    <Button
                      variant="contained"
                      disableElevation
                      sx={{ backgroundColor: "gray" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      disableElevation
                      sx={{ backgroundColor: "#632165" }}
                    >
                      Save
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
