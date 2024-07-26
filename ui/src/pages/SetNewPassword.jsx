import { Card, CardContent, CardHeader, Container, TextField, Button, Grid, Snackbar } from '@mui/material'
import { useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import { apiHost } from '../lib/api';


export default function SetNewPassword() {

    let [password, setPassword] = useState({})
    let [confirmPassword, setConfirmPassword] = useState({})
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)

    let args = qs.parse(window.location.search);
    // console.log(args)

    let setNewPassword = async () => {
        setOpen(false)
        if (confirmPassword !== password) {
            setMessage("Passwords must match")
            setOpen(true)
            return
        }
        let data = (await (await fetch(`${apiHost}/auth/new-password`,
            {
                method: 'POST',
                headers: { "Content-Type": "application/json", "Authorization":`Bearer ${args.token}`},
                body: JSON.stringify({ id: args.id, password: password})
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
            setMessage(data.message)
            setOpen(true)
            setTimeout(() => {
                navigate('/login')
            }, 1500);
            return
        }

    }
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
                            <CardHeader title="Reset Password" sx={{ color: "#632165" }}></CardHeader>
                            <CardContent>
                                <TextField
                                    sx={{ minWidth: "100%" }}
                                    type="password"
                                    placeholder="Password"
                                    size="small"
                                    onChange={e => { setPassword(e.target.value) }}

                                />
                                <br /><br />
                                <TextField
                                    sx={{ minWidth: "100%" }}
                                    type="password"
                                    placeholder="Confirm Password"
                                    size="small"
                                    onChange={e => { setConfirmPassword(e.target.value) }}

                                />
                                <br />
                                <br />
                                <Button variant="contained"
                                    disableElevation onClick={e => { setNewPassword() }}
                                    sx={{ width: "50%", marginLeft: "25%", backgroundColor: "#632165" }}
                                >RESET PASSWORD</Button>
                            </CardContent>
                        </Card>
                        <br />
                        <Button variant="outlined" onClick={e => { navigate('/login') }} sx={{ width: "50%", marginLeft: "25%", color: "#632165" }}
                        >BACK TO LOGIN</Button>
                    </Grid>
                </Grid>
            </Container>
        </>
    )

}




