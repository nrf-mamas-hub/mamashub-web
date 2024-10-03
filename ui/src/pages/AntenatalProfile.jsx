import {
  Container,
  Modal,
  CircularProgress,
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
import { useFormik } from "formik";
import * as yup from "yup";
import { createEncounter, FhirApi, apiHost } from "../lib/api";
import CurrentPatient from "../components/CurrentPatient";
import Preview from "../components/Preview";
import FormFields from "../components/FormFields";
import antenatalFields from "../lib/forms/antenatalProfile";
import { getSections } from "../lib/getFormSections";
import antenatalProfileValidationSchema from "../lib/forms/validations/antenatalProfileValidation";

export default function AntenatalProfile() {
  let [visit, setVisit] = useState();
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [data, setData] = useState({});
  let [message, setMessage] = useState(false);
  let [observations, setObservations] = useState([]);
  let isMobile = useMediaQuery("(max-width:600px)");
  let [antenatalProfile, setAntenatalProfile] = useState({});
  const handleClose = () => setOpenModal(false);
  const handleOpen = () => setOpenModal(true);
  let [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState("1");
  const [inputData, setInputData] = useState({});
  const [preview, setPreview] = useState(false);

  const fieldValues = Object.values(antenatalFields).flat();

  const initialValues = Object.assign(
    {},
    ...fieldValues.map((item) => ({ [item.name]: "" }))
  );

  const formik = useFormik({
    initialValues: {
      ...initialValues,
    },
    validationSchema: antenatalProfileValidationSchema,
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
    return;
  };

  let saveAntenatalProfile = async (values) => {
    //get current patient
    if (!visit) {
      prompt(
        "No client visit not been started. To start a visit, Select a client from the Client's list"
      );
      return;
    }

    try {
      //create Encounter
      let patient = visit.id;
      let encounter = await createEncounter(patient, "ANTENATAL_PROFILE");

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
        prompt("Antenatal Profile saved successfully");
        // navigate(`/patient/${patient}`);
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
        "No client visit not been started. To start a visit, Select a client from the Client's list"
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
      window.localStorage.setItem("next_page", "/antenatal-profile");
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
            // onClose={}
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
                <Tab label="Antenatal Profile" value={value} />
              </TabList>
            </Box>

            {preview ? (
              <Preview
                title="Antenatal Preview"
                format={antenatalFields}
                data={{ ...inputData }}
                close={() => setPreview(false)}
                submit={saveAntenatalProfile}
              />
            ) : (
              <form onSubmit={formik.handleSubmit}>
                <TabPanel value="1">
                  <FormFields
                    formData={getSections(antenatalFields, 0, 3)}
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
                        setAntenatalProfile({});
                      }}
                    >
                      CANCEL
                    </Button>

                    <Button
                      variant="contained"
                      onClick={(e) => {
                        if (!visit) {
                          prompt(
                            "No client visit not been started. To start a visit, Select a client from the Client's list"
                          );
                          return;
                        }
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
                  <FormFields
                    formData={getSections(antenatalFields, 3, 9)}
                    formik={formik}
                  />

                  <Stack direction="row" spacing={2} alignContent="right">
                    {!isMobile && (
                      <Typography sx={{ minWidth: "80%" }}></Typography>
                    )}
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        handleChange(null, "1");
                      }}
                      disableElevation
                      sx={{ backgroundColor: "gray" }}
                    >
                      PREVIOUS
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        handleChange(null, "3");
                      }}
                      disableElevation
                      sx={{ backgroundColor: "#632165" }}
                    >
                      NEXT
                    </Button>
                  </Stack>
                </TabPanel>
                <TabPanel value="3" index={3}>
                  <FormFields
                    formData={getSections(antenatalFields, 9)}
                    formik={formik}
                  />

                  <Stack direction="row" spacing={2} alignContent="right">
                    {!isMobile && (
                      <Typography sx={{ minWidth: "80%" }}></Typography>
                    )}
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        handleChange(null, "2");
                      }}
                      disableElevation
                      sx={{ backgroundColor: "gray" }}
                    >
                      PREVIOUS
                    </Button>
                    <Button
                      variant="contained"
                      disableElevation
                      sx={{ backgroundColor: "#632165" }}
                      type="submit"
                    >
                      Preview
                    </Button>
                  </Stack>
                </TabPanel>
              </form>
            )}
          </TabContext>

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
