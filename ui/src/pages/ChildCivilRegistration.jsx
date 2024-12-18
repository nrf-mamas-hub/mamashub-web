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
import { FhirApi, apiHost } from "../lib/api";
import { useFormik } from "formik";
import * as yup from "yup";
import { createEncounter, createLocation } from "../lib/api";
import Preview from "../components/Preview";
import FormFields from "../components/FormFields";
import { getSections } from "../lib/getFormSections";
import childCivilRegistrationFormFields from "../lib/forms/childiCivilRegistration";

export default function ChildCivilRegistration({ userData }) {

  let [open, setOpen] = useState(false);
  let [message, setMessage] = useState(false);
  const [preview, setPreview] = useState(false);
  let navigate = useNavigate();
  let isMobile = useMediaQuery("(max-width:600px)");
  const [value, setValue] = useState("1");
  const [inputData, setInputData] = useState({});

  const fieldValues = Object.values(childCivilRegistrationFormFields).flat();
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
      facilityName: userData?.facilityName,
      kmhflCode: userData?.kmhflCode,
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
    }, 3000);
    return;
  }

  const handleChange = (newValue) => {    
    setValue(newValue);
    return;
  };

  let registerChild = async (values) => {

    try {
      const observations = {
        gestationAtBirth: values.gestationAtBirth,
        dateFirstSeen: values.dateFirstSeen,
        birthWeight: values.birthWeight,
        birthLength: values.birthLength,
        otherBirthCharacteristics: values.otherBirthCharacteristics,
        birthOrder: values.birthOrder,
        placeOfBirth: values.placeOfBirth,
        otherPlaceOfBirth: values.otherPlaceOfBirth,
        childPhysicalAddress: `${values.county} ${values.subCounty} ${values.ward} ${values.residenceOfChild}`
      };

      let id = uuidv4();
      let response = await FhirApi({
        url: `/crud/patients/${id}`,
        method: "POST",
        data: JSON.stringify({ ...values, id: id, kmhflCode:userData?.kmhflCode }),
      });

      const relatedPeople = {        
        relatedPerson: id,        
        father: {          
          name: values.fatherName,          
          phone: values.fatherPhone          
        },
        guardian: {          
          name: values.guardianName,          
          phone: values.guardianPhone          
        }        
      }

      if (relatedPeople.father.name !== "" || relatedPeople.guardian.name !== "") {
        
        let relatedPersonResponse=await FhirApi({
          url:`/crud/related-person`,
          method: "POST",
          data: JSON.stringify(relatedPeople)
        })
  
        if (response.status !== "success" || relatedPersonResponse.status !== "success") {       
          prompt("Could not submit child/related person details");
          return;
        }
      }

      let locationResponse = await createLocation(values.placeOfBirth);

      if (locationResponse.status !== "success") {
        prompt("Cannot submit child place of birth");
        return;
      }

      let patientId = id;

      setOpen(false);

      let encounter = await createEncounter(patientId, "CHILD_CIVIL_REGISTRATION");

      prompt("Registering child");
      
      let res = await (        
        await fetch(`${apiHost}/crud/observations`, {
          method: "POST",
          body: JSON.stringify({
            patientId,
            encounterId: encounter.id,
            observations: {
              ...observations
            }
          }),
          headers: { "Content-Type": "application/json" },
        })
      ).json();

      setOpen(false);

      if (res.status === "success") {
        prompt("Child details submitted successfully");
        navigate(`/patients/${id}`);
        return;
      } else {
        prompt("Cannot submit child details");
        return;
      }
    } catch (error) {
      prompt(JSON.stringify(error));
      return;
    }
  };

  useEffect(() => {
    if (getCookie("token")) {
      return;
    } else {
      navigate("/login");
      window.localStorage.setItem("next_page", "/child-civil-registration");
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
            message={message}
            key={"loginAlert"}
          />

          <TabContext value={value}>            
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                <Tab label="Child Civil Registration" value={value} />
              </TabList>
            </Box>

            {preview ? (
              <Preview
                title="Child Civil Registration Preview"
                format={childCivilRegistrationFormFields}
                data={{ ...inputData }}
                close={() => setPreview(false)}
                submit={registerChild}
              />
            ) : (
              <form onSubmit={formik.handleSubmit}>
                <TabPanel value="1">
                  <FormFields
                    formData={getSections(childCivilRegistrationFormFields, 0, 1)}
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
                      onClick={() => {
                      }}
                    >
                      CANCEL
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() => {
                        handleChange("2");
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
                    formData={getSections(childCivilRegistrationFormFields, 1, 2)}
                    formik={formik}
                  />

                  <Stack direction="row" spacing={2} alignContent="right">
                    {!isMobile && (
                      <Typography sx={{ minWidth: "80%" }}></Typography>
                    )}
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        handleChange("1");
                      }}
                      disableElevation
                      sx={{ backgroundColor: "gray" }}
                    >
                      PREVIOUS
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        handleChange("3");
                      }}
                      disableElevation
                      sx={{ backgroundColor: "#632165" }}
                    >
                      NEXT
                    </Button>
                  </Stack>
                </TabPanel>
                <TabPanel value="3">
                  <FormFields
                    formData={getSections(childCivilRegistrationFormFields, 2, 3)}
                    formik={formik}
                  />

                  <Stack direction="row" spacing={2} alignContent="right">
                    {!isMobile && (
                      <Typography sx={{ minWidth: "80%" }}></Typography>
                    )}
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        handleChange("2");
                      }}
                      disableElevation
                      sx={{ backgroundColor: "gray" }}
                    >
                      PREVIOUS
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        handleChange("4");
                      }}
                      disableElevation
                      sx={{ backgroundColor: "#632165" }}
                    >
                      NEXT
                    </Button>
                  </Stack>
                </TabPanel>
                <TabPanel value="4" index={4}>
                  <FormFields
                    formData={getSections(childCivilRegistrationFormFields, 3)}
                    formik={formik}
                  />

                  <Stack direction="row" spacing={2} alignContent="right">
                    {!isMobile && (
                      <Typography sx={{ minWidth: "80%" }}></Typography>
                    )}
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        handleChange("3");
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
        </Container>
      </LocalizationProvider>
    </>
  );
}
