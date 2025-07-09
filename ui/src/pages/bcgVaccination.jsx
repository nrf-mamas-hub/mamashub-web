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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CurrentPatient from "../components/CurrentPatient";
import {
  createEncounter,
  FhirApi,
  createImmunization,
  createAppointment,
} from "../lib/api";
import { useFormik } from "formik";
import * as yup from "yup";
import Preview from "../components/Preview";
import FormFields from "../components/FormFields";
import bcgVaccinationFields from "../lib/forms/bcg";
import { getSections } from "../lib/getFormSections";


export default function BcgVaccineForm({ userData }) {
  let [visit, setVisit] = useState();
  let [open, setOpen] = useState(false);
  let [loading, setLoading] = useState(false);
  let [message, setMessage] = useState(false);
  let [observations, setObservations] = useState([]);
  let isMobile = useMediaQuery("(max-width:600px)");
  const [newVisit, setNewVisit] = useState(false);
  let [BcgVaccineFormEncounters, setBcgVaccineFormEncounters] = useState([]);
  const handleClose = () => setOpenModal(false);
  const handleOpen = () => setOpenModal(true);
  const [value, setValue] = useState("1");
  let [openModal, setOpenModal] = useState(false);
  const [inputData, setInputData] = useState({});
  const [preview, setPreview] = useState(false);

  const [currentEncounterId, setCurrentEncounterId] = useState(null);

  const navigate = useNavigate();

  const currentVisitIndex = BcgVaccineFormEncounters.length;


  const filterFieldsByVisit = (formSections, visitIndex) => {
    return Object.fromEntries(
      Object.entries(formSections).map(([sectionKey, fields]) => [
        sectionKey,
        fields.filter((field) => {
        if (!field) {
          return false;
        }
        const visibleFor = field.visibleFor || [];
        return visibleFor.length === 0 || visibleFor.includes(visitIndex);
      }),
      ])
    );
  };

  const filteredFormSections = filterFieldsByVisit(bcgVaccinationFields, currentVisitIndex);

  const fieldValues = Object.values(filteredFormSections).flat();
  const validationFields = fieldValues.map((field) => ({
    [field.name]: field.validate,
  }));


  const validationSchema = yup.object({
    ...Object.assign({}, ...validationFields),
  });

  const allFields = Object.values(bcgVaccinationFields).flat();
  const initialValues = Object.assign(
    {},
    ...allFields.map((item) => ({ [item.name]: "" }))
  );

  const formik = useFormik({
    initialValues: {
      ...initialValues,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setPreview(true);
      setInputData(values);
    },
  });

  function prompt(text) {
    setMessage(text);
    setOpen(true);
    setTimeout(() => setOpen(false), 4000);
  }
  const handleChange = (newValue) => setValue(newValue);

  useEffect(() => {
    let visit = window.localStorage.getItem("currentPatient");
    if (!visit) {
      setMessage(
        "No patient visit has been initiated. To start a visit, Select a patient in the Patients list"
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
    if (visit) {
      getBcgVaccineFormEncounters(visit.id);
    }
  }, [visit]);

  let getEncounterObservations = async (encounterId) => {
    
    if (currentEncounterId === encounterId) {
      return observations;
    }
    
    setObservations([]);
    setCurrentEncounterId(encounterId);
    
    try {
      let response = await FhirApi({ url: `/crud/observations?encounter=${encounterId}` });
      const encounterObservations = response.data.observations;
      setObservations(encounterObservations);
      return encounterObservations;
    } catch (error) {
      console.error("Error fetching observations:", error);
      setObservations([]);
      return [];
    }
  };

  let getBcgVaccineFormEncounters = async (patientId) => {
    setLoading(true);
    let encounters = await (
      await FhirApi({
        url: `/crud/encounters?patient=${patientId}&encounterCode=${"BCG_VACCINE"}`,
      })
    ).data;
    setBcgVaccineFormEncounters(encounters.encounters);
    setLoading(false);
    return;
  };

  let saveBcgVaccineForm = async (values) => {
    if (!visit) {
      prompt(
        "No patient visit has been initiated. To start a visit, Select a patient in the Patient's list"
      );
      return;
    }

    let patient = visit.id;

    try {
      let encounter = await createEncounter(patient, "BCG_VACCINE");

      let { practitionerId, names } = userData;
      let patientName = visit?.name;

      let immunization = { status: "success" }; 

      if (BcgVaccineFormEncounters.length === 0) {
        const immunizationDetails = {
          patientId: patient,
          encounterId: encounter.id,
          practitionerId,
          name: 'bcg',
          immunizationDate: values.immunizationDateGiven,
          lotNumber: values.lotNumber,
          expiryDate: values.dateOfExpiry,
          site: 'leftUpperForeArm',
          route: 'injectionIntradermal',
          dosage: values.bcgDosage,
          unit: 'mls',
        };

        immunization = await createImmunization(immunizationDetails);

        if (immunization.status === "success") {
          const appointmentDetails = {
            serviceCategory: 1,
            reason: 3,
            description: "BCG vaccination appointment",
            nextVisit: values.immunizationDateOfNextVisit || null,
            patientId: patient,
            patientName,
            practitionerId,
            practitionerName: names,
          };
          await createAppointment(appointmentDetails);
        } else {
          prompt("Could not submit BCG vaccination details");
          return;
        }
      }

      if (BcgVaccineFormEncounters.length === 1) {
        if (values.repeatVaccineBcg === "Yes") {
          const repeatImmunizationDetails = {
            patientId: patient,
            encounterId: encounter.id,
            practitionerId,
            name: 'bcg',
            immunizationDate: values.repeatImmunizationDateGiven,
            lotNumber: values.repeatLotNumber,
            expiryDate: values.repeatDateOfExpiry,
            site: 'leftUpperForeArm',
            route: 'injectionIntradermal',
            dosage: values.repeatBcgDosage,
            unit: 'mls',
          };

          immunization = await createImmunization(repeatImmunizationDetails);
          if (immunization.status !== "success") {
            prompt("Could not submit repeat BCG immunization details");
            return;
          }
        }
      }

      
      const bcgObservations = {};

      if (BcgVaccineFormEncounters.length === 0) {
        bcgObservations.dateOfImmunization = values.immunizationDateGiven;
        bcgObservations.nextVaccination = values.immunizationDateOfNextVisit;
      }

      if (BcgVaccineFormEncounters.length === 1) {
        bcgObservations.bcgScarDateChecked = values.bcgScarDateChecked;
        bcgObservations.bcgScarPresence = values.bcgScarPresence;
        bcgObservations.repeatVaccineBcg = values.repeatVaccineBcg;

        if (values.repeatVaccineBcg === "Yes") {
          bcgObservations.dateOfImmunization = values.repeatVaccineBcgDate;
        }
      }

      const res = await (
        await FhirApi({
          url: `/crud/observations`,
          method: "POST",
          data: JSON.stringify({
            patientId: patient,
            encounterId: encounter.id,
            observations: bcgObservations,
          }),
        })
      ).data;

      if (res.status === "success") {
        prompt("BCG Vaccine form saved successfully");
        navigate(`/patients/${patient}`);
        await getBcgVaccineFormEncounters(patient);
        setNewVisit(false);
        return;
      } else {
        prompt(res.error || "Error saving observations");
        return;
      }
    } catch (error) {
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
              title="BCG Vaccine Preview"
              format={filteredFormSections}
              data={{ ...inputData }}
              close={() => setPreview(false)}
              submit={saveBcgVaccineForm}
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
                    <Tab label="BCG Vaccine" value="1" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  {!newVisit && (
                    <Grid container spacing={1} padding=".5em">
                      {BcgVaccineFormEncounters.length > 0 &&
                        BcgVaccineFormEncounters.map((x, index) => {
                          return (
                            <Grid item xs={12} md={12} lg={12} key={index}>
                              <Button
                                variant="contained"
                                onClick={async (e) => {
                                  await getEncounterObservations(x.resource.id);
                                  handleOpen();
                                }}
                                sx={{
                                  backgroundColor: "#b58dab",
                                  width: "100%",
                                  padding: "1rem",
                                  position: "relative",
                                }}
                              >
                                {`${ordinalSuffix(index + 1)} Visit`}

                                <ArrowForwardIosIcon
                                  sx={{
                                    position: "absolute",
                                    right: "1rem",
                                  }}
                                />
                              </Button>
                            </Grid>
                          );
                        })}
                      {BcgVaccineFormEncounters.length < 2 && (
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
                            Add a visit
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  )}
                  {BcgVaccineFormEncounters.length < 1 && loading && (
                    <>
                      <CircularProgress />
                    </>
                  )}
                  <Divider />
                
                  { newVisit && (
                    <>
                      <FormFields
                        formData={filteredFormSections}
                        formik={formik}
                        encounters={BcgVaccineFormEncounters}
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
                          onClick={() => {
                            formik.resetForm();
                            setNewVisit(false);
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
                  observations.map((observation, idx) => {
                    return (
                      <React.Fragment key={idx}>
                        <Grid item lg={4} xl={6} md={6} sm={12}>
                          <Box
                            sx={{
                              padding: "1em",
                              border: "1px grey solid",
                              borderRadius: "10px",
                            }}
                          >
                            {observation.resource.code.coding &&
                              observation.resource.code.coding.map(
                                (entry, index) => {
                                  return (
                                    <React.Fragment key={index}>
                                      <Typography variant="h6">
                                        {entry.display}
                                      </Typography>
                                      <Typography variant="p">
                                        {observation.resource.valueQuantity
                                          ? observation.resource.valueQuantity
                                              .value
                                          : observation.resource.valueString ??
                                            observation.resource
                                              .valueDateTime ??
                                            "-"}
                                      </Typography>
                                    </React.Fragment>
                                  );
                                }
                              )}
                            <br />
                          </Box>
                          <p></p>
                        </Grid>
                      </React.Fragment>
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

