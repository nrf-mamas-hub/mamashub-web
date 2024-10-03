import {
  Container,
  TextField,
  Stack,
  Button,
  Grid,
  Snackbar,
  Typography,
  Divider,
  useMediaQuery,
  Radio,
  RadioGroup,
  Alert,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Checkbox,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getCookie } from "../lib/cookie";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CurrentPatient from "../components/CurrentPatient";
import { useFormik } from "formik";
import * as yup from "yup";
import Preview from "../components/Preview";
import FormFields from "../components/FormFields";
import pmtctFields from "../lib/forms/pmtct";
import { apiHost, createEncounter, FhirApi } from "./../lib/api";

export default function PMTCTInterventions() {
  let [patient, setPatient] = useState({});
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [notes, setNotes] = useState("");

  let [serologyList, setSerologyList] = useState([]);
  let [malariaProphylaxis, setMalariaProphylaxis] = useState();
  let [preventiveServiceList, setPreventiveServiceList] = useState([]);
  let [visit, setVisit] = useState();
  let [notesDisplay, setNotesDisplay] = useState("");
  let [data, setData] = useState({});

  let [message, setMessage] = useState(false);
  let isMobile = useMediaQuery("(max-width:600px)");

  const [value, setValue] = useState("1");

  const [inputData, setInputData] = useState({});
  const [preview, setPreview] = useState(false);

  const fieldValues = Object.values(pmtctFields).flat();
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

  let savePMTCTInterventions = async (values) => {
    //get current patient
    let patient = visit.id;
    if (!patient) {
      prompt(
        "No patient visit not been initiated. To start a visit, Select a patient in the Patient's list"
      );
      return;
    }

    //create encounter
    let encounter = await createEncounter(patient, "PMTCT Interventions");
    // console.log(encounter);

    //save observations
    //Create and Post Observations
    let res = await (
      await FhirApi({
        url: `/crud/observations`,
        method: "POST",
        data: JSON.stringify({
          patientId: patient,
          encounterId: encounter.id,
          observations: values,
        }),
      })
    ).data;
    // console.log(res);

    if (res.status === "success") {
      prompt("PMTCT Interventions saved successfully");
      return;
    } else {
      prompt(res.error);
      return;
    }
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    let visit = window.localStorage.getItem("currentPatient");
    if (!visit) {
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
            // onClose={""}
            message={message}
            key={"loginAlert"}
          />
          {visit && <CurrentPatient data={visit} />}
          {preview ? (
            <Preview
              title="PMTCT Interventions Preview"
              format={pmtctFields}
              data={{ ...inputData }}
              close={() => setPreview(false)}
              submit={savePMTCTInterventions}
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
                    aria-label="scrollable auto tabs example"
                  >
                    <Tab label="PMTCT Interventions" value="1" />
                  </TabList>
                </Box>

                {/* PMTCT Interventions */}
                <TabPanel value="1">
                  <FormFields formData={pmtctFields} formik={formik} />

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
