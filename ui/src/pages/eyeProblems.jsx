import React, { useEffect, useState } from "react";
import {
  Container,
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
import { apiHost, createEncounter, FhirApi } from "../lib/api";
import { useFormik } from "formik";
import * as yup from "yup";
import Preview from "../components/Preview";
import FormFields from "../components/FormFields";
import eyeProblemsFields from "../lib/forms/earlyEyeProblems";

export default function EarlyEyeProblems() {
  let [visit, setVisit] = useState();
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [loading, setLoading] = useState(false);
  let [message, setMessage] = useState(false);
  let [observations, setObservations] = useState([]);
  let isMobile = useMediaQuery("(max-width:600px)");
  const [newVisit, setNewVisit] = useState(false);
  let [earlyEyeProblems, setEarlyEyeProblems] = useState({});
  let [earlyEyeProblemsEncounters, setEarlyEyeProblemsEncounters] = useState(
    []
  );
  const handleClose = () => setOpenModal(false);
  const handleOpen = () => setOpenModal(true);
  const [value, setValue] = useState("1");
  let [openModal, setOpenModal] = useState(false);

  const [inputData, setInputData] = useState({});
  const [preview, setPreview] = useState(false);

  const ageGroups = ["At Birth", "At 6 months", "At 9 months", "At 18 months"];

  const currentVisitIndex = earlyEyeProblemsEncounters.length;
  
  const currentAgeGroup = ageGroups[currentVisitIndex];

  const getSections = (fields, visitIndex, visitNumber) => {
    const currentAgeGroup = ageGroups[visitIndex] || `Visit ${visitIndex + 1}`;
  
    const formattedSections = {};
    
    Object.keys(fields).forEach(section => {
      const visibleFields = fields[section].filter(field => 
        field.visibleFor && field.visibleFor.includes(visitIndex)
      );
      

      if (visibleFields.length > 0) {
        const updatedFields = visibleFields.map(field => ({
          ...field,
          label: field.label.includes('At Birth') && visitIndex > 0 
            ? field.label.replace('At Birth', currentAgeGroup) 
            : field.label,
        }));
        
        formattedSections[section] = updatedFields;
      }
    });
    
    return formattedSections;
  };

  const fieldValues = Object.values(getSections(eyeProblemsFields, currentVisitIndex, currentVisitIndex + 1)).flat();
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
      [item.name]: item.type === 'radio' ? '' : ''
    }))
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
    if (getCookie("token")) {
      return;
    } else {
      window.localStorage.setItem("next_page", "/early-eye-problems");
      navigate("/login");
      return;
    }
  }, []);

  useEffect(() => {
    let visit = window.localStorage.getItem("currentPatient");
    if (!visit) {
      prompt(
        "No patient visit has been initiated. To start a visit, Select a patient in the Patients list"
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
      getEarlyEyeProblemsEncounter(visit.id);
    }
  }, []);

  let getEncounterObservations = async (encounter) => {
      setObservations([]);
      handleOpen();
      let observations = await (
        await FhirApi({ url: `/crud/observations?encounter=${encounter}` })
      ).data;
      
      setObservations(observations.observations);
      return;
    };

  let getEarlyEyeProblemsEncounter = async (patientId) => {
    setLoading(true);
    
    let encounters = await (
      await FhirApi({
        url: `/crud/encounters?patient=${patientId}&encounterCode=${"EARLY_EYE_PROBLEMS"}`,
      })
    ).data;
  
    setEarlyEyeProblemsEncounters(encounters.encounters);
    
    if (encounters.encounters.length === 0) {
      setNewVisit(true);
    } else {
      setNewVisit(false);
    }
    
    setLoading(false);
    return;
  };

  let saveEarlyEyeProblems = async (values) => {
    if (!visit) {
      prompt(
        "No patient visit has been initiated. To start a visit, Select a patient in the Patient's list"
      );
      return;
    }
    let patient = visit.id;
    try {
      let encounter = await createEncounter(patient, "EARLY_EYE_PROBLEMS");

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

      if (res.status === "success") {
        prompt(`Eye assessment for ${currentAgeGroup} saved successfully`);
        navigate(`/patients/${patient}`);
        await getEarlyEyeProblemsEncounter(patient);
        setNewVisit(false);
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
  
  const ordinalSuffix = (i) => {
    let j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  };


  const getVisitLabel = (index) => {
    return ageGroups[index] || `Visit ${index + 1}`;
  };

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
              title={`Early Eye Problems - ${currentAgeGroup}`}
              format={getSections(eyeProblemsFields, currentVisitIndex, currentVisitIndex + 1)}
              data={{ ...inputData }}
              close={() => setPreview(false)}
              submit={saveEarlyEyeProblems}
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
                    <Tab label="Early Eye Problems" value="1" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  {/* <p></p> */}
                  {!newVisit && (
                  <Grid container spacing={1} padding=".5em">
                    {earlyEyeProblemsEncounters.length > 0 &&
                      earlyEyeProblemsEncounters.map((x, index) => {
                        return (
                          <Grid item xs={12} md={6} lg={3} key={index}>
                            <Button
                              variant="contained"
                              onClick={(e) => {
                                getEncounterObservations(x.resource.id);
                              }}
                              sx={{ backgroundColor: "#632165", width: "99%" }}
                            >
                              {`${getVisitLabel(index)}`}
                            </Button>
                          </Grid>
                        );
                      })}
                      {/* Only show "Add a visit" button if we have fewer than 4 visits total */}
                      {earlyEyeProblemsEncounters.length < 4 && (
                      <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "2rem",
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={(e) => {
                            setNewVisit(true);
                          }}
                          sx={{
                            backgroundColor: "#632165",
                          }}
                        >
                          {`Add ${currentAgeGroup} Assessment`}
                        </Button>
                      </Grid>
                    )}
                  </Grid>)}
                  
                  {earlyEyeProblemsEncounters.length < 1 && loading && (
                    <>
                      <CircularProgress />
                    </>
                  )}
                  <Divider />
                  {newVisit && (
                    <>
                      <Box sx={{ py: 2 }}>
                        <Typography variant="h6" sx={{ color: "#632165" }}>
                          {`Eye Assessment for ${currentAgeGroup}`}
                        </Typography>
                      </Box>
                      <FormFields 
                        formData={getSections(eyeProblemsFields, currentVisitIndex, currentVisitIndex + 1)} 
                        formik={formik} 
                        encounters={earlyEyeProblemsEncounters}
                        getEncounterObservations={getEncounterObservations}
                      /> 
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
                          onClick={() => setNewVisit(false)}
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
                  </>
                  )}
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
                  observations.map((observation, index) => {
                    return (
                      <>
                        <Grid container key={index}>
                          {observation.resource && observation.resource.code && observation.resource.code.coding &&
                            observation.resource.code.coding.map((entry, entryIndex) => {
                              return (
                                <>
                                  <Grid item lg={6} xl={6} md={6} sm={6} key={`entry-${entryIndex}`}>
                                    <Typography>{entry.display}</Typography>
                                  </Grid>
                                  <Grid item lg={6} xl={6} md={6} sm={6} key={`value-${entryIndex}`}>
                                    <Typography variant="p">
                                      {observation.resource.valueQuantity
                                        ? observation.resource.valueQuantity.value
                                        : observation.resource.valueString ??
                                          observation.resource.valueDateTime ??
                                          "-"}
                                    </Typography>
                                  </Grid>
                                </>
                              );
                            })}
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