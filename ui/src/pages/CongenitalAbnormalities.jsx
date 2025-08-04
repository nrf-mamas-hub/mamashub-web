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
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CurrentPatient from "../components/CurrentPatient";
import { useFormik } from "formik";
import * as yup from "yup";
import Preview from "../components/Preview";
import FormFields from "../components/FormFields";
import congenitalAbnormalitiesFields from "../lib/forms/congenitalAbnormalities";
import { createEncounter, FhirApi } from "../lib/api";

export default function CongenitalAbnormalities() {
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);

  let [visit, setVisit] = useState();
  let [message, setMessage] = useState(false);
  let isMobile = useMediaQuery("(max-width:600px)");

  const [value, setValue] = useState("1");

  const [inputData, setInputData] = useState({});
  const [preview, setPreview] = useState(false);

  const fieldValues = Object.values(congenitalAbnormalitiesFields).flat();
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
      [item.name]: item.type === "checkbox" ? [] : "",
    }))
  );

  const formik = useFormik({
    initialValues: {
      ...initialValues,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      setPreview(true);
      setInputData(values);
    },
  });

  const prompt=(text)=>{

    setMessage(text);
    setOpen(true);

    setTimeout(() => {
      setOpen(false);
    }, 4000);

    return;
  }

  let saveCongenitalAbnormalities = async (values) => {
    let patient = visit.id;
    if (!patient) {
      prompt(
        "No patient visit has been initiated. To start a visit, Select a client from the Client list"
      );
      return;
    }
    try {

      // create encounter
        let encounter = await createEncounter(patient, "CONGENITAL_ABNORMALITIES");
        console.log("Encounter created:", encounter);

        let res = await (
            await FhirApi({
            url: `/crud/observations`,
            method: "POST",
            data: JSON.stringify({
                patientId: patient,
                encounterId: encounter.id,
                observations: values,
            })
            })
        ).data;

        if (res.status === "success") {
            prompt("Early Identification of Congenital Abnormalities saved successfully");
            navigate(`/patients/${patient}`);
            return;
        } else {
            prompt(res.error);
            return;
        }
    } catch (error) {
      console.error(error);
      prompt("An error occurred while saving the congenital abnormalities data");
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

  useEffect(() => {
    const abnormalTypes = formik.values.headSizeAbnormalType || [];
  
    // Clear 'headSizeOtherSpecifyType' if 'headSizeOtherSpecify' is not selected
    if (!abnormalTypes.includes('headSizeOtherSpecify') && formik.values.headSizeOtherSpecifyType !== '') {
      formik.setFieldValue('headSizeOtherSpecifyType', '');
    }
  }, [formik, formik.values.headSizeAbnormalType]);

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
              title="Early Identification of Congenital Abnormalities Preview"
              format={congenitalAbnormalitiesFields}
              data={{ ...inputData }}
              close={() => setPreview(false)}
              submit={saveCongenitalAbnormalities}
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
                    <Tab label="Early Identification of Congenital Abnormalities" value="1" />
                  </TabList>
                </Box>

                <TabPanel value="1">
                  <FormFields formData={congenitalAbnormalitiesFields} formik={formik} />
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
                </TabPanel>
              </TabContext>
            </form>
          )}
        </Container>
      </LocalizationProvider>
    </>
  );
}
