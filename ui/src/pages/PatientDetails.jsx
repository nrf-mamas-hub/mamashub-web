import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Snackbar,
  Divider,
  Modal,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FhirApi, apiHost } from "../lib/api";
import { timeSince } from "../lib/timeSince";

export default function PatientDetails() {
  let [patient, setPatient] = useState(null);
  let { id } = useParams();
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [openModal, setOpenModal] = useState(false);
  let [message, setMessage] = useState("");
  let [observations, setObservations] = useState([]);
  let [encounters, setEncounters] = useState(null);
  const handleClose = () => setOpenModal(false);
  const handleOpen = () => setOpenModal(true);

  useEffect(() => {
    getPatientDetails(id);
  }, []);

  let getFacilityVisits = async (patientId) => {
    let visits = await FhirApi({
      url: `/crud/encounters?patient=${patientId}`,
    });
    setEncounters(visits.data.encounters);
    // console.log(visits);
    return;
  };

  let getPatientObservations = async (patientId) => {
    let observations = await FhirApi({
      url: `/crud/observations?patientId=${patientId}`,
    });
    setObservations(observations.data.observations);
    return;
  };

  let getEncounterObservations = async (encounter) => {
    setObservations([]);
    handleOpen();
    let observations = await (
      await FhirApi({ url: `/crud/observations?encounter=${encounter}` })
    ).data;
    console.log(observations);
    setObservations(observations.observations);
    return;
  };

  let getPatientDetails = async (id) => {
    setOpen(false);
    let data = await FhirApi({
      url: `/crud/patients/${id}`,
      method: "GET",
    });
    console.log(data);
    data = data.data;
    setOpen(false);
    if (data.status === "error") {
      setMessage(data.error);
      setOpen(true);
      return;
    } else {
      setPatient(data.patient);
      return;
    }
  };
  useEffect(() => {
    getFacilityVisits(id);
    // getPatientObservations(id)
  }, []);

  return (
    <>
      <Container>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          onClose={""}
          message={message}
          key={"loginAlert"}
        />
        <Button
          variant="outlined"
          onClick={(e) => {
            navigate("/patients");
          }}
          sx={{ width: "30%", marginLeft: "25%", color: "#632165" }}
        >
          BACK TO PATIENTS LIST
        </Button>
        <br />
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} lg={10} md={12} sx={{ paddingTop: "2%" }}>
            <Card sx={{ backgroundColor: "", border: "1px black solid" }}>
              <CardHeader
                title={`Patient Information`}
                sx={{ color: "#632165" }}
              ></CardHeader>
              <Divider></Divider>
              <CardContent>
                {patient ? (
                  <>
                    <Typography variant="h5">{patient.fullNames}</Typography>
                    <Typography>Patient ID: {(id).substring(0, 7 )}</Typography>
                    <Typography>ANC Number: {patient.ancNumber}</Typography>
                    <Typography>
                      Age: {timeSince(new Date(patient.dob))}
                    </Typography>
                    <Typography>Phone: {patient.phone}</Typography>
                  </>
                ) : (
                  <Typography>Loading</Typography>
                )}
                <Divider />
                {encounters && (
                  <>
                    <p></p>
                    <Typography variant="h6">Facility Visits</Typography>
                    <p></p>

                    {/* <Typography>{JSON.stringify(encounters)}</Typography> */}
                    {encounters.map((encounter) => {
                      return (
                        <>
                          <Box
                            sx={{
                              padding: "1em",
                              border: "1px grey solid",
                              borderRadius: "10px",
                            }}
                          >
                            <Typography variant="p">
                              {encounter.resource.reasonCode[0].coding[0].code}
                            </Typography>
                            <br />
                            <Typography variant="p" sx={{ fontWeight: "" }}>
                              Created:{" "}
                              <b>{`${timeSince(
                                new Date(
                                  encounter.resource.meta.lastUpdated
                                ).toUTCString()
                              )} ago`}</b>
                            </Typography>
                            <p></p>
                            <Button
                              sx={{ backgroundColor: "#632165" }}
                              variant="contained"
                              onClick={(e) => {
                                getEncounterObservations(encounter.resource.id);
                              }}
                            >
                              PREVIEW
                            </Button>
                            <br />
                          </Box>
                          <p></p>
                        </>
                      );
                    })}
                  </>
                )}
                <Divider />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      {/* Add User Modal  */}
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
                                <Typography variant="p">
                                  {entry.display}
                                </Typography>
                                <Typography variant="p">
                                  {observation.resource.valueQuantity
                                    ? observation.resource.valueQuantity.value
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
    </>
  );
}
