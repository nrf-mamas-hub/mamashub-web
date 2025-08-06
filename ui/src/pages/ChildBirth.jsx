import {
  Container,
  Stack,
  Button,
  Snackbar,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CurrentPatient from "../components/CurrentPatient";
import Preview from "../components/Preview";
import FormFields from "../components/FormFields";
import childBirthFields from "../lib/forms/childBirth";
import { createEncounter, FhirApi } from "../lib/api";

export default function ChildBirth() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [visit, setVisit] = useState(null);
  const [inputData, setInputData] = useState({});
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const fieldValues = Object.values(childBirthFields).flat();
  const initialValues = Object.assign(
    {},
    ...fieldValues.map((item) => ({
      [item.name]: item.type === "checkbox" ? [] : item.type === "date" ? null : "",
    }))
  );
  const validationFields = fieldValues
    .filter((item) => item.validate)
    .map((item) => ({ [item.name]: item.validate }));
  const validationSchema = yup.object(Object.assign({}, ...validationFields));

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setInputData(values);
      setPreview(true);
    },
  });

  const showMessage = (text, duration = 6000) => {
    setMessage(text);
    setOpen(true);
    setTimeout(() => setOpen(false), duration);
  };

  const saveChildBirth = async (values) => {
    if (!visit?.id) {
      showMessage("No patient visit initiated. Please select a client from the Client list.");
      return;
    }

    setLoading(true);
    try {
      const encounter = await createEncounter(visit.id, "CHILD_BIRTH");
      const response = await FhirApi({
        url: `/crud/observations`,
        method: "POST",
        data: JSON.stringify({
          patientId: visit.id,
          encounterId: encounter.id,
          observations: values,
        }),
      });

      console.log("Observations response:", response.data);

      if (response.data.status === "success") {
        showMessage("Childbirth record saved successfully");
        setPreview(false);
        formik.resetForm();
      } else {
        showMessage(response.data.error || "Failed to save childbirth record");
      }
    } catch (error) {
      console.error("Save error:", error);
      showMessage("An error occurred while saving the childbirth record");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const storedVisit = window.localStorage.getItem("currentPatient");
      if (storedVisit) {
        setVisit(JSON.parse(storedVisit));
      } else {
        showMessage("No patient selected. Please select a client.");
      }
    } catch (error) {
      console.error("Error parsing currentPatient:", error);
      showMessage("Invalid patient data. Please select a client.");
    }
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container sx={{ border: "1px white dashed", p: 2 }}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          message={message}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
        />
        {visit && <CurrentPatient data={visit} />}
        {preview ? (
          <Preview
            title="Childbirth Preview"
            format={childBirthFields}
            data={inputData}
            close={() => setPreview(false)}
            submit={saveChildBirth}
            edit={() => setPreview(false)} 
          />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormFields formData={childBirthFields} formik={formik} />
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={2} justifyContent={isMobile ? "center" : "flex-end"}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => formik.resetForm()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                Preview
              </Button>
            </Stack>
          </form>
        )}
      </Container>
    </LocalizationProvider>
  );
}