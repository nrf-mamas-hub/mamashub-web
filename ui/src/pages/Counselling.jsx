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
  Radio,
  RadioGroup,
  Alert,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getCookie } from "../lib/cookie";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CurrentPatient from "../components/CurrentPatient";
import { useFormik } from "formik";
import * as yup from "yup";
import counsellingForm from "../lib/forms/counselling";
import Preview from "../components/Preview";
import FormFields from "../components/FormFields";
import { createEncounter, FhirApi } from "../lib/api";
import { apiHost } from "../lib/api";

export default function Counselling() {
  let [open, setOpen] = useState(false);
  let [notes, setNotes] = useState("");
  const [preview, setPreview] = useState(false);
  const [inputData, setInputData] = useState({});

  let [visit, setVisit] = useState();
  let [counselling, setConselling] = useState({});
  let [message, setMessage] = useState(false);
  let isMobile = useMediaQuery("(max-width:600px)");

  const [value, setValue] = useState("1");

  const fieldValues = Object.values(counsellingForm).flat();
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
    // submit form
    onSubmit: (values) => {
      console.log(values);
      setPreview(true);
      setInputData(values);
      return;
    },
  });

  let saveCounsellingForm = async (values) => {
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
      let encounter = await createEncounter(patient, "COUNSELLING");
      // console.log(encounter);

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
          headers: { "Content-Type": "application/json" },
        })
      ).data;
      // console.log(res);

      if (res.status === "success") {
        prompt("Conselling Form saved successfully");
        // navigate(`/patient/${patient}`);
        return;
      } else {
        prompt(res.error);
        return;
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    return;
  };
  useEffect(() => {
    let visit = window.localStorage.getItem("currentPatient");
    if (!visit) {
      return;
    }
    setVisit(JSON.parse(visit));
    return;
  }, []);
  const sections = Object.keys(counsellingForm);

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
              title="Counselling Preview"
              format={counsellingForm}
              data={{ ...inputData }}
              close={() => setPreview(false)}
              submit={saveCounsellingForm}
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
                    <Tab label="Counselling" value="1" />
                  </TabList>
                </Box>

                {/* Preventive Services  */}

                <TabPanel value="1">
                  <FormFields formData={counsellingForm} formik={formik} />

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
