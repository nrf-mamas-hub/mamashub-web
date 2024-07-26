import { Card, CardContent, CardHeader, Container, TextField, Button, Grid, Typography, Snackbar, useMediaQuery } from '@mui/material'
import { useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import FileUpload from "react-mui-fileuploader"
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

export default function Register() {

    let [registration, setRegistration] = useState({})
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)
    let isMobile = useMediaQuery('(max-width:600px)');
    const handleFileUploadError = (error) => {
        // Do something...
        console.log(error)
      }
      
      const handleFilesChange = (files) => {
        // Do something...
        console.log(files[0])
        setRegistration({ ...registration, passport_photo: files[0] })

      }

    let register = async () => {
        let requiredFields = ['first_name', 'phone', 'email', 'password', 'dob', 'surname', 'passport_photo', 'id_number' ]
        for (let i; i < requiredFields.length; i++) {
            if (!(requiredFields[i] in Object.keys(registration))) {
                console.log(`${requiredFields[i]} is missing`)
                setMessage(`${requiredFields[i]} is required`)
                setOpen(!open)
                return
            }
        }
        let data = (await (await fetch(`/api/method/fosa.api.auth.create_user`,
            {
                method: 'POST',
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(registration)
            }
        )).json())
        if (data.status === "error") {
            setMessage(data.error)
            setOpen(!open)
            return
        }
        navigate('/login')
        console.log(data)
        return
    }

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Container>
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={open}
                        // onClose={""}
                        message={message}
                        key={"registerAlert"}
                    />
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item xs={12} lg={6} md={12} sx={{ paddingTop: "10%" }}>
                            <Typography variant="h5" sx={{ textAlign: "center" }}>Maslai SACCO</Typography>
                            <br />
                            <Card sx={{ maxWidth: "500px", backgroundColor: "", border: "1px black solid" }}>
                                <CardHeader title="Member Registration" sx={{ color: "green" }}></CardHeader>
                                <CardContent>
                                    <TextField
                                        sx={{ minWidth: "100%" }}
                                        type="text"
                                        placeholder="First Name"
                                        size="small"
                                        onChange={e => { setRegistration({ ...registration, first_name: e.target.value }) }}
                                    />
                                    <br /><br />
                                    <TextField
                                        sx={{ minWidth: "100%" }}
                                        type="surname"
                                        placeholder="Surname"
                                        size="small"
                                        onChange={e => { setRegistration({ ...registration, surname: e.target.value }) }}
                                    />
                                    <br /><br />
                                    <TextField
                                        sx={{ minWidth: "100%" }}
                                        type="id_number"
                                        placeholder="ID Number"
                                        size="small"
                                        onChange={e => { setRegistration({ ...registration, id_number: e.target.value }) }}
                                    />
                                    <br /><br />
                                    <TextField
                                        sx={{ minWidth: "100%" }}
                                        type="tel"
                                        placeholder="Phone Number"
                                        size="small"
                                        onChange={e => { setRegistration({ ...registration, phone: e.target.value }) }}
                                    />
                                    <br /><br />
                                    <TextField
                                        sx={{ minWidth: "100%" }}
                                        type="email"
                                        placeholder="Email Address"
                                        size="small"
                                        onChange={e => { setRegistration({ ...registration, email: e.target.value }) }}
                                    />
                                    <br /><br />
                                    {isMobile ? <MobileDatePicker
                                        label="Date of Birth"
                                        sx={{ minWidth: "100%" }}
                                        inputFormat="dd/MM/yyyy"
                                        value={registration.dob ? registration.dob : null}
                                        onChange={e => { setRegistration({ ...registration, dob: new Date(e).toLocaleDateString() }) }}
                                        renderInput={(params) => <TextField {...params} />}
                                    /> : <DesktopDatePicker
                                        label="Date of Birth"
                                        sx={{ minWidth: "100%" }}
                                        inputFormat="dd/MM/yyyy"
                                        value={registration.dob ? registration.dob : null}
                                        onChange={e => { setRegistration({ ...registration, dob: new Date(e).toLocaleDateString() }) }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />}
                                    <br /><br />
                                    <TextField
                                        sx={{ minWidth: "100%" }}
                                        type="text"
                                        placeholder="Next of Kin Name"
                                        size="small"
                                        onChange={e => { setRegistration({ ...registration, next_of_kin: e.target.value }) }}
                                    />
                                    <br /><br />
                                    <TextField
                                        sx={{ minWidth: "100%" }}
                                        type="tel"
                                        placeholder="Next of Kin Number"
                                        size="small"
                                        onChange={e => { setRegistration({ ...registration, next_of_kin_number: e.target.value }) }}
                                    />
                                    <br /><br />
                                    <TextField
                                        type="password"
                                        placeholder="Password"
                                        sx={{ minWidth: "100%" }}
                                        size="small"
                                        onChange={e => { setRegistration({ ...registration, password: e.target.value }) }}
                                    />
                                    <br /><br />
                                    <TextField
                                        type="password"
                                        placeholder="Confirm Password"
                                        sx={{ minWidth: "100%" }}
                                        size="small"
                                        onChange={e => { setRegistration({ ...registration, confirmPassword: e.target.value }) }}
                                    />
                                    <br />
                                    <br />
                                    <Typography variant="h5">
                                        <FileUpload
                                            multiFile={false}
                                            disabled={false}
                                            title="Attach Passport Photo"
                                            header="[Drag to drop]"
                                            leftLabel="or"
                                            rightLabel="to select files"
                                            buttonLabel="click here"
                                            maxFileSize={10}
                                            maxUploadFiles={2}
                                            maxFilesContainerHeight={357}
                                            errorSizeMessage={'fill it or move it to use the default error message'}
                                            allowedExtensions={['jpg', 'jpeg']}
                                            onFilesChange={handleFilesChange}
                                            onError={handleFileUploadError}
                                            bannerProps={{ elevation: 0, variant: "outlined", display:"none" }}
                                            containerProps={{ elevation: 0, variant: "outlined" }}
                                        />
                                    </Typography>
                                    <br/>
                                    <Button disableElevation variant="contained" sx={{ width: "50%", marginLeft: "25%", backgroundColor: "green" }}
                                        onClick={e => { register() }}
                                    >Register</Button>
                                </CardContent>
                            </Card>
                            <br />
                            <Typography sx={{ textDecoration: "underline" }}
                                textAlign="center"
                            ><a href="/login">Already Registered? Login.</a></Typography>
                            <br />
                            <br />
                            <br />
                        </Grid>
                    </Grid>
                </Container>
            </LocalizationProvider>
        </>
    )

}




