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
import malariaProphylaxisFields from "../lib/forms/malariaProphylaxis";
import { apiHost, createEncounter, FhirApi } from "./../lib/api";

export default function MalariaProphylaxis() {
  let [patient, setPatient] = useState({});
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [malariaProphylaxis, setMalariaProphylaxis] = useState({});
  let [malariaProphylaxisList, setMalariaProphylaxisList] = useState([]);
  let [notes, setNotes] = useState("");

  let malariaProphylaxisContacts = {
    "Upto 12 weeks": "-",
    "13-16 weeks": "IPTp - SP dose 1",
    "20 weeks": "IPTp - SP dose 2",
    "26 weeks": "IPTp - SP dose 3",
    "30 weeks": "IPTp - SP dose 4",
    "34 weeks": "IPTp - SP dose 5",
    "36 weeks": "No SP, if last dose received <1 Month ago",
    "38 weeks": "IPTp - SP dose 6 (if no dose in past month)",
    "40 weeks": "-",
  };

  let [visit, setVisit] = useState();
  let [data, setData] = useState({});
  let [preventiveService, setPreventiveService] = useState(null);
  let [maternalSerology, setMaternalSerology] = useState({});
  let [message, setMessage] = useState(false);
  let isMobile = useMediaQuery("(max-width:600px)");

  const [value, setValue] = useState("1");
  const [inputData, setInputData] = useState({});
  const [preview, setPreview] = useState(false);

  const fieldValues = Object.values(malariaProphylaxisFields).flat();
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
    },
    validationSchema: validationSchema,
    // submit form
    onSubmit: (values) => {
      console.log(values);
      setPreview(true);
      setInputData(values);
    },
  });

  const prompt=(text) => {
    setMessage(text);
    setOpen(true);

    setTimeout(() => {
      setOpen(false)
    }, 4000);

    return;
  };


  let saveMalariaProphylaxis = async (values) => {
    //get current patient
    let patient = visit.id;
    if (!patient) {
      prompt(
        "No patient visit not been initiated. To start a visit, Select a patient in the Patient's list"
      );
      return;
    }

    //create encounter
    let encounter = await createEncounter(patient, "MALARIA-PROPHYLAXIS");
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
        headers: { "Content-Type": "application/json" },
      })
    ).data;
    // console.log(res);

    if (res.status === "success") {
      prompt("Malaria Prophylaxis saved successfully");
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
              title="Malaria Prophylaxis Preview"
              format={malariaProphylaxisFields}
              data={{ ...inputData }}
              close={() => setPreview(false)}
              submit={saveMalariaProphylaxis}
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
                    <Tab label="Malaria Prophylaxis" value="1" />
                  </TabList>
                </Box>

                {/* Malaria Prophylaxis */}
                <TabPanel value="1">
                  <FormFields
                    formData={malariaProphylaxisFields}
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
