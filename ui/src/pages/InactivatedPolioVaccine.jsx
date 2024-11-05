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
  CircularProgress,
  Modal,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getCookie } from "../lib/cookie";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import CurrentPatient from "../components/CurrentPatient";
import { apiHost, createEncounter, FhirApi } from "../lib/api";
import { useFormik } from "formik";
import * as yup from "yup";
import Preview from "../components/Preview";
import FormFields from "../components/FormFields";
import tetanusDiptheriaFields from "../lib/forms/tetanusAndDiptheria";
import inactivatedPolioVaccineDetailsForm from "../lib/forms/Inactivatedpoliovaccine";
import { v4 as uuidv4 } from "uuid";


export default function InactivatedPolioVaccine() {
  
  let [visit, setVisit] = useState();
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [loading, setLoading] = useState(false);
  let [message, setMessage] = useState(false);
  let [observations, setObservations] = useState([]);
  let isMobile = useMediaQuery("(max-width:600px)");
  let [inactivatedPolioVaccine,setInactivatedPolioVaccine] = useState({});
  let [InactivatedPolioVaccineEncounters, setInactivatedPolioVaccineEncounters] = useState(
    []
  );
  
  const handleClose = () => setOpenModal(false);
  const handleOpen = () => setOpenModal(true);
  const [value, setValue] = useState("1");
  let [openModal, setOpenModal] = useState(false);

  const [inputData, setInputData] = useState({});
  const [preview, setPreview] = useState(false);

  const fieldValues = Object.values(inactivatedPolioVaccineDetailsForm).flat();
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
  };

  useEffect(() => {
    let visit = window.localStorage.getItem("currentPatient");
    if (!visit) {
      setMessage(
        "No patient visit not been initiated. To start a visit, Select a patient in the Patients list"
      );
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 4000);
      return;
    }
    setVisit(JSON.parse(visit));
    return;
  }, []);

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
    let visit = window.localStorage.getItem("currentPatient") ?? null;
    visit = JSON.parse(visit) ?? null;
    if (visit) {
      getInactivatedPolioVaccineEncounters(visit.id);
    }
  }, []);
  useEffect(() => {
      setInactivatedPolioVaccine(inactivatedPolioVaccineDetailsForm);
  },[]);

  let getEncounterObservations = async (encounter) => {
    setObservations([]);
    handleOpen();
    let observations = await (
      await FhirApi({
        url: `/crud/observations?encounter=${encounter}`,
      })
    ).data;
    setObservations(observations.observations);
    return;
  };

  let getInactivatedPolioVaccineEncounters = async (patientId) => {
    setLoading(true);
    let encounters = await (
      await FhirApi({
        url: `/crud/encounters?patient=${patientId}&encounterCode=${"INACTIVATED_POLIO_VACCINE"}`,
      })
    ).data;
    console.log(encounters);
    setInactivatedPolioVaccineEncounters(encounters.encounters);
    setLoading(false);
    return;
  };
  let saveInactivatedPolioVaccine = async (values) => {
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
      let encounter = await createEncounter(patient,"INACTIVATED_POLIO_VACCINE");
      // console.log(encounter)

      //Create and Post Observations
      let res = await (
        await fetch(`${apiHost}/crud/observations`, {
          method: "POST",
          body: JSON.stringify({
            patientId: patient,
            encounterId: encounter.id,
            observations: values,
          }),
          headers: { "Content-Type": "application/json" },
        })
      ).json();
      console.log(res);

      if (res.status === "success") {
        prompt("Child civil registration saved successfully");
        // setValue('2')
        navigate(`/patients/${patient}`);
        await getInactivatedPolioVaccineEncounters(patient);
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
              title="Inactivated Polio Vaccine Preview"
              format={inactivatedPolioVaccine}
              data={{ ...inputData }}
              close={() => setPreview(false)}
              submit={saveInactivatedPolioVaccine}
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
                    <Tab label="Inactivated Polio Vaccine" value="1" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  {/* <p></p> */}
                  <Grid container spacing={1} padding=".5em">
                    {InactivatedPolioVaccineEncounters.length > 0 &&
                      InactivatedPolioVaccineEncounters.map((x, index) => {
                    
                      })}
                  </Grid>
                  {InactivatedPolioVaccineEncounters.length < 1 && loading && (
                    <>
                      <CircularProgress />
                    </>
                  )}
                  <Divider />

                  <FormFields formData={inactivatedPolioVaccine} formik={formik} />

                  
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
                width: "90%",
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
                        <Grid container>
                          {observation.resource.code.coding &&
                            observation.resource.code.coding.map((entry) => {
                              return (
                                <>
                                  <Grid item lg={6} xl={6} md={6} sm={6}>
                                    <Typography>{entry.display}</Typography>
                                  </Grid>
                                  <Grid item lg={6} xl={6} md={6} sm={6}>
                                    <Typography variant="p">
                                      {observation.resource.valueQuantity
                                        ? observation.resource.valueQuantity
                                            .value
                                        : observation.resource.valueString ??
                                          observation.resource.valueDateTime ??
                                          "-"}
                                    </Typography>
                                  </Grid>
                                </>
                              );
                            })}
                          {/* <br /> */}
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
