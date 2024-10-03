import {
  Container,
  FormGroup,
  Modal,
  TextField,
  Stack,
  Button,
  CircularProgress,
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
import { Patient } from "../lib/fhir/resources";
import CurrentPatient from "../components/CurrentPatient";
import { timeSince } from "../lib/timeSince";
import { useFormik } from "formik";
import * as yup from "yup";
import Preview from "../components/Preview";
import FormFields from "../components/FormFields";
import previousPregnancyFields from "../lib/forms/previousPregnancy";

export default function PreviousPregnancy() {
  let [patient, setPatient] = useState({});
  let [visit, setVisit] = useState();
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  const [value, setValue] = useState("1");
  let [loading, setLoading] = useState(false);
  let [message, setMessage] = useState(false);
  let isMobile = useMediaQuery("(max-width:600px)");
  let [previousPregnancy, setPreviousPregnancy] = useState({});
  let [observations, setObservations] = useState([]);
  let [openModal, setOpenModal] = useState(false);
  let [previousPregnancyEncounters, setPreviousPregnancyEncounters] = useState(
    []
  );

  const [inputData, setInputData] = useState({});
  const [preview, setPreview] = useState(false);

  const fieldValues = Object.values(previousPregnancyFields).flat();
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
      setPreview(true);
      setInputData(values);
    },
  });
  const handleClose = () => setOpenModal(false);
  const handleOpen = () => setOpenModal(true);

  function prompt(text) {
    setMessage(text);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 4000);
    return;
  }

  let savePreviousPregnancy = async (values) => {
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
      let encounter = await createEncounter(patient, "PREVIOUS_PREGNANCY");
      console.log("These are the prev preg values: ", values);
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
      console.log(res);

      if (res.status === "success") {
        prompt("Previous Pregnancy saved successfully");
        // setValue('2')
        await getPreviousPregnancyEncounters(patient);
        return;
      } else {
        prompt(res.error);
        return;
      }
    } catch (error) {
      console.error(error);
      prompt(JSON.stringify(error));
      return;
    }
  };

  let getPreviousPregnancyEncounters = async (patientId) => {
    setLoading(true);
    let encounters = await (
      await FhirApi({
        url: `/crud/encounters?patient=${patientId}&encounterCode=${"PREVIOUS_PREGNANCY"}`,
      })
    ).data;
    console.log(encounters);
    setPreviousPregnancyEncounters(encounters.encounters);
    setLoading(false);
    return;
  };

  useEffect(() => {
    let visit = window.localStorage.getItem("currentPatient") ?? null;
    visit = JSON.parse(visit) ?? null;
    if (visit) {
      getPreviousPregnancyEncounters(visit.id);
    }
  }, []);

  let getEncounterObservations = async (encounter) => {
    setObservations([]);
    handleOpen();
    let observations = (
      await FhirApi({
        url: `/crud/observations?encounter=${encounter}`,
      })
    ).json();
    setObservations(observations.observations);
    return;
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    return;
  };

  useEffect(() => {
    let visit = window.localStorage.getItem("currentPatient");
    if (!visit) {
      prompt(
        "No patient visit not been initiated. To start a visit, Select a patient in the Patients list"
      );
      return;
    }
    setVisit(JSON.parse(visit));
    return;
  }, []);

  useEffect(() => {
    if (getCookie("token")) {
      window.localStorage.setItem("activeTab", "previous-pregnancy");
      return;
    } else {
      window.localStorage.setItem("next_page", "/previous-pregnancy");
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
          {preview ? (
            <Preview
              title="Previous Pregancy Preview"
              format={previousPregnancyFields}
              data={{ ...inputData }}
              close={() => setPreview(false)}
              submit={savePreviousPregnancy}
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
                    <Tab label="Previous Pregnancy" value="1" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <Grid container spacing={1} padding=".5em">
                    {previousPregnancyEncounters.length > 0 &&
                      previousPregnancyEncounters.map((x, index) => {
                        return (
                          <Grid item xs={12} md={12} lg={3}>
                            <Button
                              variant="contained"
                              onClick={(e) => {
                                getEncounterObservations(x.resource.id);
                              }}
                              sx={{ backgroundColor: "#632165", width: "99%" }}
                            >
                              Pregnancy - {`${index + 1}`}
                            </Button>
                          </Grid>
                        );
                      })}
                    {previousPregnancyEncounters.length < 1 && loading && (
                      <>
                        <CircularProgress />
                      </>
                    )}
                  </Grid>

                  <FormFields
                    formData={previousPregnancyFields}
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
                      disableElevation
                        sx={{ backgroundColor: "#632165" }}
                        type="submit"
                    >
                      Save
                    </Button>
                  </Stack>
                  <p></p>
                </TabPanel>
              </TabContext>
            </form>
          )}
          <Modal
            keepMounted
            open={openModal}
            sx={{ overflow: "scroll" }}
            onClose={handleClose}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <br />
              {((observations && observations.length < 1) || !observations) && (
                <>
                  <CircularProgress />
                  <Typography variant="h6">Loading</Typography>
                </>
              )}
              <Grid container columnSpacing={1}>
                {observations &&
                  observations.map((observation) => {
                    return (
                      <>
                        <Grid item lg={4} xl={6} md={6} sm={12}>
                          <Box
                            sx={{
                              padding: "1em",
                              border: "1px grey solid",
                              borderRadius: "10px",
                            }}
                          >
                            {/* <Typography sx={{ fontWeight: "bold" }} variant="p">Time: {new Date(observation.resource.meta.lastUpdated).toUTCString()}</Typography><br /> */}
                            {/* <Typography variant="p">Observation Code: {JSON.stringify(observation.resource.code.coding)}</Typography> */}
                            {observation.resource.code.coding &&
                              observation.resource.code.coding.map((entry) => {
                                return (
                                  <>
                                    <Typography variant="h6">
                                      {entry.display}
                                    </Typography>
                                    <Typography variant="p">
                                      {observation.resource.valueQuantity
                                        ? observation.resource.valueQuantity
                                            .value
                                        : observation.resource.valueString ??
                                          observation.resource.valueDateTime ??
                                          "-"}
                                    </Typography>
                                    {/* <br /> */}
                                  </>
                                );
                              })}
                            <br />
                          </Box>
                          <p></p>
                        </Grid>
                      </>
                    );
                  })}
              </Grid>
            </Box>
          </Modal>
        </Container>
      </LocalizationProvider>
    </>
  );
}
