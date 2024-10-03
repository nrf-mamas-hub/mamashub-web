import {
  Container,
  TextField,
  Modal,
  Stack,
  Button,
  Grid,
  Snackbar,
  FormGroup,
  Checkbox,
  Typography,
  Divider,
  useMediaQuery,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  CircularProgress,
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
  LinearProgress,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CurrentPatient from "../components/CurrentPatient";
import { apiHost, createEncounter, FhirApi } from "./../lib/api";
import { timeSince } from "../lib/timeSince";
import { useFormik } from "formik";
import * as yup from "yup";
import physicalExaminationFields from "../lib/forms/physicalExamination";
import Preview from "../components/Preview";
import FormFields from "../components/FormFields";
import physicalExaminationValidationSchema from "../lib/forms/validations/physicalExaminationValidation";

var Highcharts = require("highcharts");
// Load module after Highcharts is loaded
require("highcharts/modules/exporting")(Highcharts);

export default function PhysicalExam() {
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [notes, setNotes] = useState({});
  let [loading, setLoading] = useState(false);
  let [weightMonitoringChart, setWeightMonitoring] = useState([]);

  let [visit, setVisit] = useState();
  let [physicalExam, setPhysicalExam] = useState({});
  let [physicalExamEncounters, setPhysicalExamEncounters] = useState([]);
  let [data, setData] = useState({});
  let [message, setMessage] = useState(false);
  let isMobile = useMediaQuery("(max-width:600px)");
  let [observations, setObservations] = useState([]);
  let [openModal, setOpenModal] = useState(false);
  const [preview, setPreview] = useState(false);
  const [inputData, setInputData] = useState({});
  const handleClose = () => setOpenModal(false);
  const handleOpen = () => setOpenModal(true);

  const [value, setValue] = useState("1");

  const fieldValues = Object.values(physicalExaminationFields).flat();

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
    validationSchema: physicalExaminationValidationSchema,
    // submit form
    onSubmit: (values) => {
      // console.log(values);
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

  let getPhysicalExamEncounters = async (patientId) => {
    setLoading(true);
    let encounters = await (
      await FhirApi({
        url: `/crud/encounters?patient=${patientId}&encounterCode=${"PHYSICAL_EXAMINATION"}`,
      })
    ).data;
    console.log(encounters);
    setPhysicalExamEncounters(encounters.encounters);
    setLoading(false);
    return;
  };

  useEffect(() => {
    let visit = window.localStorage.getItem("currentPatient") ?? null;
    visit = JSON.parse(visit) ?? null;
    if (visit) {
      getPhysicalExamEncounters(visit.id);
      return;
    }
    // console.log(visit);
  }, []);

  let savePhysicalExam = async (values) => {
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
      let encounter = await createEncounter(patient, "PHYSICAL_EXAMINATION");
      // console.log(encounter);

      //Create and Post Observations
        let res = (
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
        prompt("Physical Examination saved successfully");
        // setValue('2')
        setTimeout(() => {
          getPhysicalExamEncounters(patient);
        }, 100);
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

  useEffect(() => {
    if (document.getElementById("container")) {
      Highcharts.chart("container", {
        chart: {
          type: "line",
        },
        title: {
          text: "Weight Monitoring",
        },
        subtitle: {
          text: "Reload to refresh data",
        },
        xAxis: {
          categories: [
            "4",
            "6",
            "8",
            "10",
            "12",
            "14",
            "16",
            "18",
            "20",
            "22",
            "24",
            "26",
          ],
          title: {
            text: "Gestation in weeks",
          },
        },
        yAxis: {
          title: {
            text: "Weight",
          },
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true,
            },
            enableMouseTracking: false,
          },
        },
        series: [
          {
            name: "Patient",
            data: [70, 69, 69, 72, 73, 73, 72, 74, 76, 78, 77, 77],
          },
        ],
      });
      return;
    }
  }, [document.getElementById("container")]);

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
              >
                <Tab label="Physical Examination" value="1" />
                <Tab label="Weight Monitoring Chart" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              {preview ? (
                <Preview
                  title="Patient Registration Preview"
                  format={physicalExaminationFields}
                  data={{ ...inputData }}
                  close={() => setPreview(false)}
                  submit={savePhysicalExam}
                />
              ) : (
                <form onSubmit={formik.handleSubmit}>
                  <FormFields
                    formData={physicalExaminationFields}
                    formik={formik}
                  />

                  <Stack direction="row" spacing={2} alignContent="right">
                    {!isMobile && (
                      <Typography sx={{ minWidth: "80%" }}></Typography>
                    )}
                    <Button
                      variant="contained"
                      disableElevation
                      sx={{ backgroundColor: "gray" }}
                      onClick={(e) => {
                        setPhysicalExam({});
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
                      Save
                    </Button>
                  </Stack>
                  <p></p>
                </form>
              )}
            </TabPanel>

            <TabPanel value="2">
              <Typography
                variant="p"
                sx={{ fontSize: "large", fontWeight: "bold" }}
              >
                Weight Monitoring
              </Typography>
              <Divider />
              <p></p>
              <div
                id="container"
                style={{ width: "100%", height: "400px" }}
              ></div>
              <p></p>
            </TabPanel>
          </TabContext>
          <Modal
            keepMounted
            open={openModal}
            sx={{ overflow: "scroll" }}
            onClose={handleClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
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
