import {
  Container,
  Stack,
  Button,
  Snackbar,
  Typography,
  Divider,
  useMediaQuery,
} from "@mui/material";
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
import { createEncounter, FhirApi, createAllergyIntolerance } from "../lib/api";
import { useFormik } from "formik";
import * as yup from "yup";
import Preview from "../components/Preview";
import FormFields from "../components/FormFields";
import AEFIFields from "../lib/forms/aefi";

export default function AEFI({ userData }) {
  let [visit, setVisit] = useState();
  let [open, setOpen] = useState(false);
  let [message, setMessage] = useState(false);
  let isMobile = useMediaQuery("(max-width:600px)");
  const [value, setValue] = useState("1");
  const [inputData, setInputData] = useState({});
  const [preview, setPreview] = useState(false);

  const navigate = useNavigate();

  const fieldValues = Object.values(AEFIFields).flat();
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
    setTimeout(() => setOpen(false), 4000);
  }

  let saveAEFI = async (values) => {
    let patient = visit.id;

    if (!patient) {
      prompt(
        "No patient visit not been initiated. To start a visit, Select a client from the Client list"
      );
      return;
    }

    let encounter = await createEncounter(patient, "AEFI"); 
    
    let aefiDetails = {
      onset: values.date,
      patientId: patient,      
      practitionerId: userData?.practitionerId,
      encounterId: encounter.id,      
      description: values.intoleranceDescription,
      vaccine: values.antigenOrVaccine
    }

    let { date, antigenOrVaccine, ...aefiObservations } = values;
    
    let allergyIntolerance = await createAllergyIntolerance(aefiDetails);

    if (allergyIntolerance.status !== "success") {    
      prompt("Error saving AEFI, please try again");
      return;
    }

    let res = await (
      await FhirApi({
        url: `/crud/observations`,
        method: "POST",
        data: JSON.stringify({
          patientId: patient,
          encounterId: encounter.id,
          observations: aefiObservations
        }),
      })
    ).data;

    if (res.status === "success") {
      prompt("AEFI saved successfully");
      navigate(`/patients/${patient}`);
      return;
    } else {
      prompt(res.error);
      return;
    }
  };

  const handleChange = (newValue) => {    
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
            message={message}
            key={"loginAlert"}
          />
          {visit && <CurrentPatient data={visit} />}
          {preview ? (
            <Preview
              title="AEFI Preview"
              format={AEFIFields}
              data={{ ...inputData }}
              close={() => setPreview(false)}
              submit={saveAEFI}
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
                    <Tab
                      label="Adverse Event Following Immunization"
                      value="1"
                    />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <FormFields formData={AEFIFields} formik={formik} />
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
