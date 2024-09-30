import {
  Typography,
  Stack,
  Button,
  Divider,
  Container,
  useMediaQuery,
  Box,
  Snackbar,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../lib/cookie';
import { apiHost } from '../lib/api';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CurrentPatient from '../components/CurrentPatient';
import { useFormik } from 'formik';
import * as yup from 'yup';
import referralForm from '../lib/forms/referral';
import Preview from '../components/Preview';
import FormFields from '../components/FormFields';

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ' years';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes';
  }
  return Math.floor(seconds) + ' seconds';
}

export default function PatientList() {
  let [referrals, setReferrals] = useState([]);
  let navigate = useNavigate();
  let [selected, setSelected] = useState([]);
  let [open, setOpen] = useState(false);
  let [visit, setVisit] = useState();
  const [value, setValue] = useState('1');
  let [message, setMessage] = useState(false);
  const [preview, setPreview] = useState(false);
  const [inputData, setInputData] = useState({});

  const fieldValues = Object.values(referralForm).flat();
  const validationFields = fieldValues.map(item => ({
    [item.name]: item.validate,
  }));

  const validationSchema = yup.object({
    ...Object.assign({}, ...validationFields),
  });

  const initialValues = Object.assign(
    {},
    ...fieldValues.map(item => ({ [item.name]: '' }))
  );

  const formik = useFormik({
    initialValues: {
      ...initialValues,
    },
    validationSchema: validationSchema,
    // submit form
    onSubmit: values => {
      console.log(values);
      setPreview(true);
      setInputData(values);
    },
  });

  let getReferrals = async () => {
    let data = await (
      await fetch(`${apiHost}/referrals`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('token')}`,
        },
      })
    ).json();
    console.log(data);
    if (data.status === 'success' && data.data.length > 0) {
      for (let v of data.data) {
        v.createdAt = timeSince(new Date(v.createdAt)) + ' ago';
        v.dob = timeSince(new Date(v.dob)) + ' old';
      }
    }
    setReferrals(data.data);
    return;
  };

  useEffect(() => {
    getReferrals();
  }, []);

  useEffect(() => {
    if (getCookie('token')) {
      return;
    } else {
      navigate('/login');
      window.localStorage.setItem('next_page', '/community-referrals');
      return;
    }
  }, []);

  let isMobile = useMediaQuery('(max-width:600px)');

  const handleSubmit = async values => {
    console.log(values);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container sx={{ border: '1px white dashed' }}>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            // onClose={''}
            message={message}
            key={'loginAlert'}
          />
          {visit && <CurrentPatient data={visit} />}
          {preview ? (
            <Preview
              title='Community Referral Preview'
              format={referralForm}
              data={{ ...inputData }}
              close={() => setPreview(false)}
              submit={handleSubmit}
            />
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList
                    value={value}
                    // onChange={handleChange}
                    variant='scrollable'
                    scrollButtons='auto'
                    aria-label='scrollable auto tabs example'
                  >
                    <Tab label='Referrals' value='1' />
                  </TabList>
                </Box>

                <TabPanel value='1'>
                  <FormFields formData={referralForm} formik={formik} />

                  <p></p>
                  <Divider />
                  <p></p>
                  <Stack direction='row' spacing={2} alignContent='right'>
                    {!isMobile && (
                      <Typography sx={{ minWidth: '80%' }}></Typography>
                    )}
                    <Button
                      variant='contained'
                      disableElevation
                      sx={{ backgroundColor: 'gray' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant='contained'
                      disableElevation
                      sx={{ backgroundColor: '#632165' }}
                      type='submit'
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
