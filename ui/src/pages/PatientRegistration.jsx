import {
  Container,
  Stack,
  Button,
  Snackbar,
  Typography,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../lib/cookie";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { v4 as uuidv4 } from "uuid";
import { FhirApi, apiHost } from "./../lib/api";
import { useFormik } from "formik";
import * as yup from "yup";
import { createEncounter } from "../lib/api";
import patientRegistrationFields from "../lib/forms/patientRegistration";
import Preview from "../components/Preview";
import FormFields from "../components/FormFields";

export default function PatientRegistration({ userData }) {
  let [open, setOpen] = useState(false);
  let [message, setMessage] = useState(false);
  const [preview, setPreview] = useState(false);
  let navigate = useNavigate();
  let isMobile = useMediaQuery("(max-width:600px)");
  const [value, setValue] = useState("1");
  const [inputData, setInputData] = useState({});

  const geneRateAncCode = () => {
    let ancCode = "";
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    ancCode = `${year}-${month}-`;
    return ancCode;
  };

  const fieldValues = Object.values(patientRegistrationFields).flat();
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
      ancCode: geneRateAncCode(),
      facilityName: userData?.facilityName,
      kmhflCode: userData?.kmhflCode,
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
    }, 3000);
    return;
  }

  let displayAlert = async (message) => {
    setMessage(message);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 1500);
    return;
  };

  useEffect(() => {
    if (getCookie("token")) {
      window.localStorage.setItem("activeTab", "patient-registration");
      return;
    } else {
      navigate("/login");
      window.localStorage.setItem("next_page", "/patient-registration");
      return;
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    return;
  };

  let registerPatient = async (values) => {
    try {
      const observations = {
        edd: values.edd,
        patientPhoneNumber: values.phone,
        educationLevel: values.educationLevel,
        maritalStatus: values.maritalStatus,
        contactPhoneNumber: values.nextOfKinPhone,
        gravidae: values.gravidae,
        parity: values.parity,
        bodyWeight: values.weight,
        bodyHeight: values.height,
        lmp: values.lmp,
      };

      // save patient in HAPI FHIR server first
      let id = uuidv4();
      let response = await FhirApi({
        url: `/crud/patients/${id}`,
        method: "POST",
        data: JSON.stringify({ ...values, id: id }),
      });

      // save patient in local database
      let saveResponse = (await (await fetch(`${apiHost}/client/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, id: id })
      })).json());

      console.log(response);
      if (response.status !== "success" && saveResponse.status !== "success") {        
        return;
      }

      //Create Encounter
      let patientId = id;
      //create encounter
      setOpen(false)
      let encounter = await createEncounter(patientId, "PATIENT_INFO");
      prompt("Registering patient");

      

      //Create and Post Observations
      let res = await (
        await fetch(`${apiHost}/crud/observations`, {
          method: "POST",
          body: JSON.stringify({
            patientId: patientId,
            encounterId: encounter.id,
            observations: {
              ...observations,
              physicalAddress: `${values.county}, ${values.subCounty}, ${values.ward}, ${values.estate}`,
            },
          }),
          headers: { "Content-Type": "application/json" },
        })
      ).json();
      setOpen(false);

      if (res.status === "success") {
        prompt("Patient created successfully...");
        navigate(`/patients/${id}`);
        return;
      } else {
        prompt(res.error);
        return;
      }
    } catch (error) {
      console.log(error);
      prompt(JSON.stringify(error));
      return;
    }
  };

  useEffect(() => {
    if (getCookie("token")) {
      return;
    } else {
      navigate("/login");
      window.localStorage.setItem("next_page", "/patient-registration");
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
          {preview ? (
            <Preview
              title="Patient Registration Preview"
              format={patientRegistrationFields}
              data={{ ...inputData }}
              close={() => setPreview(false)}
              submit={registerPatient}
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
                    <Tab label="Client Registration" value="1" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <FormFields
                    formData={patientRegistrationFields}
                    formik={formik}
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
        </Container>
      </LocalizationProvider>
    </>
  );
}
