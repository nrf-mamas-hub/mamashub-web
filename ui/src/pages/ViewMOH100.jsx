import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Typography,
  Button,
  Grid,
  Snackbar,
  Divider,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCookie } from '../lib/cookie';
import { apiHost } from '../lib/api';
import Layout from '../components/Layout';
import { timeSince } from '../lib/timeSince';

export default function ViewMOH100() {
  let [patient, setPatient] = useState();
  let { id } = useParams();
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [message, setMessage] = useState(false);

  useEffect(() => {
    getPatientDetails(id);
  }, []);

  let getPatientDetails = async id => {
    setOpen(false);
    let data = await (
      await fetch(`${apiHost}/referrals/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('token')}`,
        },
      })
    ).json();
    console.log(data);
    setOpen(false);
    if (data.status === 'error') {
      setMessage(data.error);
      setOpen(true);
      return;
    } else {
      setPatient(data.data);
      return;
    }
  };

  return (
    <>
      <Container>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open}
          // onClose={''}
          message={message}
          key={'loginAlert'}
        />
        <Button
          variant='outlined'
          onClick={e => {
            navigate('/community-referrals');
          }}
          sx={{ width: '30%', marginLeft: '25%', color: '#632165' }}
        >
          BACK TO REFERRAL LIST
        </Button>
        <br />
        <Grid container justifyContent='center' alignItems='center'>
          <Grid item xs={12} lg={10} md={12} sx={{ paddingTop: '2%' }}>
            <Card sx={{ backgroundColor: '', border: '1px black solid' }}>
              <CardHeader
                title={`Patient Referral`}
                sx={{ color: '#632165' }}
              ></CardHeader>
              <Divider></Divider>
              <CardContent>
                {patient ? (
                  <>
                    <Typography variant='h5'>
                      {patient.firstName + ' ' + patient.lastName}{' '}
                    </Typography>
                    <Typography>
                      <b>Sex:</b> {patient.sex}
                    </Typography>
                    <Typography>
                      <b>Age: </b>
                      {timeSince(new Date(patient.dob))}
                    </Typography>
                    <Typography>
                      <b>Phone: </b>
                      {patient.phone}
                    </Typography>
                    <p></p>
                    <Divider />
                    <p></p>
                    <Typography>
                      <b>Main Problems: </b>
                      {patient.data.mainProblems}
                    </Typography>
                    <Typography>
                      <b>Reasons for Referral:</b>{' '}
                      {patient.data.reasonsForReferral}
                    </Typography>
                    <Typography>
                      <b>Treatment Given: </b>
                      {patient.data.treatmentGiven ?? 'N/A'}
                    </Typography>
                    <Typography>
                      <b>Comments: </b>
                      {patient.data.comments ?? 'N/A'}
                    </Typography>
                    <Typography>
                      <b>Referral Time: </b>
                      {timeSince(new Date(patient.createdAt))}
                    </Typography>
                    <p></p>
                    <Divider />
                    <p></p>
                    <Typography variant='h5'>Residence</Typography>
                    <Typography>
                      <b>Ward: </b>
                      {patient.residence.ward}
                    </Typography>
                    <Typography>
                      <b>Sub-County: </b>
                      {patient.residence.subCounty}
                    </Typography>
                    <Typography>
                      <b>County: </b>
                      {patient.residence.county}
                    </Typography>
                    <Typography>
                      <b>Street: </b>
                      {patient.residence.street}
                    </Typography>
                  </>
                ) : (
                  <Typography>Loading</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
