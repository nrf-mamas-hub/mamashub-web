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
import { apiHost, createEncounter, FhirApi } from "../lib/api";
import { useFormik } from "formik";
import * as yup from "yup";
import Preview from "../components/Preview";
import FormFields from "../components/FormFields";
import postnatalCareFields from "../lib/forms/motherPostNatalCare";

export default function MotherPostnatalCare() {
    const [patient, setPatient] = useState({});
    const [visit, setVisit] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(false);
    const [observations, setObservations] = useState([]);
    const isMobile = useMediaQuery("(max-width:600px)");
    const [newVisit, setNewVisit] = useState(false);
    const [motherPostNatalCare, setmotherPostNatalCare] = useState({});
    const [motherPostNatalCareEncounters, setmotherPostNatalCareEncounters] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [inputData, setInputData] = useState({});
    const [preview, setPreview] = useState(false);
    const [value, setValue] = useState("1");

    const navigate = useNavigate();
    
    const fieldValues = postnatalCareFields ? Object.values(postnatalCareFields).flat() : [];
    
    const validationFields = fieldValues.map((item) => ({
        [item?.name || 'defaultField']: item?.validate || yup.string()
    }));

    const validationSchema = yup.object({
        ...Object.assign({}, ...validationFields),
    });

    const initialValues = fieldValues.reduce((acc, item) => {
        if (item && item.name) {
            acc[item.name] = item.defaultValue || "";
        }
        return acc;
    }, {});

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            console.log(values);
            setPreview(true);
            setInputData(values);
        },
    });

    const handleClose = () => setOpenModal(false);
    const handleOpen = () => setOpenModal(true);

    function prompt(text) {
        setMessage(text);
        setOpen(true);
        setTimeout(() => setOpen(false), 4000);
    }

    const handleChange = (event, newValue) => setValue(newValue);

    useEffect(() => {
        const visitData = window.localStorage.getItem("currentPatient");
        if (!visitData) {
            prompt("No patient visit has been initiated. To start a visit, Select a patient in the Patients list");
            return;
        }
        try {
            const parsedVisit = JSON.parse(visitData);
            setVisit(parsedVisit);
        } catch (error) {
            console.error("Error parsing visit data:", error);
            prompt("Error loading patient visit data");
        }
    }, []);

    useEffect(() => {
        if (visit?.id) {
            getMotherPostNatalCareEncounters(visit.id);
        }
    }, [visit]);

    const getEncounterObservations = async (encounter) => {
        try {
            setObservations([]);
            const response = await FhirApi({ url: `/crud/observations?encounter=${encounter}` });
            const observations = response.data?.observations || [];
            setObservations(observations);
            return observations;
        } catch (error) {
            console.error("Error fetching observations:", error);
            prompt("Error loading observations");
            return [];
        }
    };

    const getMotherPostNatalCareEncounters = async (patientId) => {
        try {
            setLoading(true);
            const response = await FhirApi({
                url: `/crud/encounters?patient=${patientId}&encounterCode=${"MOTHER_POSTNATAL_CARE"}`,
            });
            setmotherPostNatalCareEncounters(response.data?.encounters || []);
        } catch (error) {
            console.error("Error fetching encounters:", error);
            prompt("Error loading encounters");
        } finally {
            setLoading(false);
        }
    };

    const saveMotherPostNatalCare = async (values) => {
        if (!visit?.id) {
            prompt("No patient visit has been initiated. To start a visit, Select a patient in the Patient's list");
            return;
        }

        try {
            const encounter = await createEncounter(visit.id, "MOTHER_POSTNATAL_CARE");
            const response = await FhirApi({
                url: `/crud/observations`,
                method: "POST",
                data: JSON.stringify({
                    patientId: visit.id,
                    encounterId: encounter.id,
                    observations: values,
                }),
            });

            if (response.data?.status === "success") {
                prompt("Mother Postnatal Care saved successfully");
                navigate(`/patients/${visit.id}`);
                await getMotherPostNatalCareEncounters(visit.id);
                setNewVisit(false);
            } else {
                prompt(response.data?.error || "Error saving data");
            }
        } catch (error) {
            console.error("Error saving postnatal care:", error);
            prompt("Error saving data");
        }
    };

    const ordinalSuffix = (i) => {
        const j = i % 10;
        const k = i % 100;
        if (j === 1 && k !== 11) return i + "st";
        if (j === 2 && k !== 12) return i + "nd";
        if (j === 3 && k !== 13) return i + "rd";
        return i + "th";
    };

    return (
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
                        title="Mother Postnatal care Preview"
                        format={postnatalCareFields}
                        data={inputData}
                        close={() => setPreview(false)}
                        submit={saveMotherPostNatalCare}
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
                                    <Tab label="Mother Postnatal Care" value="1" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                {!newVisit && (
                                    <Grid container spacing={1} padding=".5em">
                                        {motherPostNatalCareEncounters.map((x, index) => (
                                            <Grid item xs={12} md={12} lg={12} key={index}>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => {
                                                        getEncounterObservations(x.resource.id);
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
                                        ))}
                                        {motherPostNatalCareEncounters.length < 4 && (
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
                                                    onClick={() => setNewVisit(true)}
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
                                {motherPostNatalCareEncounters.length < 1 && loading && (
                                    <CircularProgress />
                                )}
                                <Divider />

                                {newVisit && postnatalCareFields && (
                                    <>
                                        <FormFields
                                            formData={postnatalCareFields}
                                            formik={formik}
                                            encounters={motherPostNatalCareEncounters}
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
                                                onClick={() => setNewVisit(false)}
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
                        {(!observations || observations.length < 1) && (
                            <>
                                <CircularProgress />
                                <Typography variant="h6">Loading</Typography>
                            </>
                        )}
                        <Grid container columnSpacing={1}>
                            {observations?.map((observation, idx) => (
                                <React.Fragment key={idx}>
                                    <Grid item lg={4} xl={6} md={6} sm={12}>
                                        <Box
                                            sx={{
                                                padding: "1em",
                                                border: "1px grey solid",
                                                borderRadius: "10px",
                                            }}
                                        >
                                            {observation.resource.code.coding?.map(
                                                (entry, index) => (
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
                                                )
                                            )}
                                            <br />
                                        </Box>
                                        <p></p>
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Grid>
                    </Box>
                </Modal>
            </Container>
        </LocalizationProvider>
    );
}