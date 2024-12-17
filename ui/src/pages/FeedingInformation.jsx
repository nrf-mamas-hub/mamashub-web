
import {
  Container,
  Stack,
  Button,
  Snackbar,
  Typography,
  Divider,
  useMediaQuery,
} from '@mui/material';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import feedingInfoFields from "../lib/forms/feedingInformation";



export default function FeedingInfo() {
  let [visit, setVisit] = useState();
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [message, setMessage] = useState("");
  let [observations, setObservations] = useState([]);
  let isMobile = useMediaQuery("(max-width:600px)");
  let [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState("1");
  const [inputData, setInputData] = useState({});
  const [preview, setPreview] = useState(false);

  const fieldValues = Object.values(feedingInfoFields).flat();
  const validationFields = fieldValues.map((item) => ({
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
}

let saveFeedingInfo = async (values) => {
  //get current patient
  let patient = visit.id;
  if (!patient) {
    prompt(
      "No patient visit not been initiated. To start a visit, Select a client from the Client list"
    );
    return;
  }

  //create encounter
  let encounter = await createEncounter(patient, "Feeding Information");
  // console.log(encounter);

  //save observations
  //Create and Post Observations
  let res = await (
    await FhirApi({
      url: '/crud/observations',
      method: "POST",
      data: JSON.stringify({
        patientId: patient,
        encounterId: encounter.id,
        observations: values,
      })
    })
  ).data;
  // console.log(res);

  if (res.status === "success") {
    prompt("Feeding Information saved successfully");
    navigate('/patients/${patient}');
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
            title="Feeding information from parent/guardian Preview"
            format={ feedingInfoFields}
            data={{ ...inputData }}
            close={() => setPreview(false)}
            submit={saveFeedingInfo}
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
                  <Tab label="Feeding information from parent/guardian " value="1" />
                </TabList>
              </Box>
          {/* Preventive Services  */}

          <TabPanel value="1">
                  <FormFields formData={feedingInfoFields} formik={formik} />
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












