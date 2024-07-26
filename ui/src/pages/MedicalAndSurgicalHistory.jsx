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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { v4 as uuidv4 } from "uuid";
import { createEncounter, FhirApi, apiHost } from "../lib/api";
import CurrentPatient from "../components/CurrentPatient";
import { useFormik } from "formik";
import * as yup from "yup";
import medicalSurgicalForm from "../lib/forms/medicalSurgicalHistory";
import Preview from "../components/Preview";
import FormFields from "../components/FormFields";
import { getSections } from "../lib/getFormSections";

export default function ANCProfile() {
  let [visit, setVisit] = useState();
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [data, setData] = useState({});
  let [message, setMessage] = useState(false);
  let isMobile = useMediaQuery("(max-width:600px)");
  let [medicalHistory, setMedicalHistory] = useState({});

  const [value, setValue] = useState("1");
  const [inputData, setInputData] = useState({});
  const [preview, setPreview] = useState(false);

  const fieldValues = Object.values(medicalSurgicalForm).flat();
  const validationFields = fieldValues.map((item) => ({
    [item.name]: item.validate,
  }));

  const validationSchema = yup.object({
    ...Object.assign({}, ...validationFields),
  });

  const initialValues = Object.assign(
    {},
    ...fieldValues.map((item) => ({
      [item.name]: item.type === "checkbox" ? [] : "",
    }))
  );

  const formik = useFormik({
    initialValues: {
      ...initialValues,
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
  const handleChanges = (event) => {
    console.log(event);
    return;
  };

  let saveMedicalHistory = async (values) => {
    console.log(values);
    //get current patient
    if (!visit) {
      prompt(
        "No patient visit not been initiated. To start a visit, Select a patient in the Patient's list"
      );
      return;
    }
    let patient = visit.id;
    try {
      //create Encounter
      let encounter = await createEncounter(patient, "MEDICAL_HISTORY");
      console.log(encounter);

      //Create and Post Observations
      let res = (
        await FhirApi({
          url: `/crud/observations`,
          method: "POST",
          data: JSON.stringify({
            patientId: patient,
            encounterId: encounter,
            observations: medicalHistory,
          }),
        })
      ).data;
      console.log(res);

      if (res.status === "success") {
        prompt("Medical and Surgical History saved successfully");
        navigate(`/patients/${patient}`);
        return;
      } else {
        prompt(res.error);
        return;
      }
    } catch (error) {
      console.error(error);
      // prompt(JSON.stringify(error))
      return;
    }
  };

  useEffect(() => {
    let visit = window.localStorage.getItem("currentPatient");
    if (!visit) {
      prompt(
        "No patient visit not been initiated. To start a visit, Select a patient in the Patient's list"
      );
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
            // onClose={""}
            message={message}
            key={"loginAlert"}
          />
          {visit && <CurrentPatient data={visit} />}
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                <Tab label="Medical and Surgical History" value="1" />
                <Tab value="2" hidden />
              </TabList>
            </Box>
            {preview ? (
              <Preview
                title="Patient Registration Preview"
                format={medicalSurgicalForm}
                data={{ ...inputData }}
                close={() => setPreview(false)}
                submit={saveMedicalHistory}
              />
            ) : (
              <form onSubmit={formik.handleSubmit}>
                <TabPanel value="1">
                  <FormFields
                    formData={getSections(medicalSurgicalForm, 0, 2)}
                    formik={formik}
                  />

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
                      onClick={(e) => {
                        setMedicalHistory({});
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        handleChange(null, "2");
                      }}
                      disableElevation
                      sx={{ backgroundColor: "#632165" }}
                    >
                      NEXT
                    </Button>
                  </Stack>
                  <p></p>
                </TabPanel>
                <TabPanel value="2">
                  <p></p>
                  <FormFields
                    formData={getSections(medicalSurgicalForm, 2, 4)}
                    formik={formik}
                  />
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
                      onClick={(e) => {
                        handleChange(null, "1");
                      }}
                    >
                      PREVIOUS
                    </Button>
                    <Button
                      variant="contained"
                      disableElevation
                      sx={{ backgroundColor: "#632165" }}
                      type="submit"
                    >
                      PREVIEW
                    </Button>
                  </Stack>
                  <p></p>
                </TabPanel>
              </form>
            )}
          </TabContext>
        </Container>
      </LocalizationProvider>
    </>
  );
}
