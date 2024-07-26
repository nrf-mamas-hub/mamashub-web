import { Card, CardContent, CardHeader, Container, TextField, Button, Grid, Snackbar } from '@mui/material'
import { useEffect, useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import {getCookie} from '../lib/cookie'

//organization details
//location details http://build.fhir.org/ig/WorldHealthOrganization/smart-anc/Location-anc-location-example.json.html


export default function Setup({id}) {

    let [patient, setPatient] = useState({})
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)

    let getPatientDetails = async ({id}) => {
        setOpen(false)
        let data = (await (await fetch(`/api/fhir/Patient/${id}`,
            {
                method: 'POST',
                headers: { "Content-Type": "application/json", "Authorization":`Bearer ${getCookie("token")}`},
            }
        )).json())
        console.log(data)
        setOpen(false)
        if (data.status === "error") {
            setMessage(data.error)
            setOpen(true)
            return
        }
        else {
            setPatient(data.patient)
            return
        }
    }

    useEffect(() => {
        getPatientDetails(id)
    },[])
    return (
        <>
            <Container>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={open}
                    // onClose={""}
                    message={message}
                    key={"loginAlert"}
                />
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item xs={12} lg={6} md={12} sx={{ paddingTop: "10%" }}>
                        <br />
                        <Card sx={{ maxWidth: "500px", backgroundColor: "", border: "1px black solid" }}>
                            <CardHeader title={`Patient/${id}`} sx={{ color: "#632165" }}></CardHeader>
                            <CardContent>
                                {patient && JSON.stringify(patient)}
                            </CardContent>
                        </Card>
                        <br />
                        <Button variant="outlined" onClick={e => { navigate('/patients') }} sx={{ width: "50%", marginLeft: "25%", color: "#632165" }}
                        >BACK TO PATIENTS LIST</Button>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}




