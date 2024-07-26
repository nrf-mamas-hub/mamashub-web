import { Divider, Container, TextField, Button, Typography, Snackbar, useMediaQuery, Box } from '@mui/material'
import { useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiHost } from '../lib/api'
import { setCookie } from '../lib/cookie'

export default function Login() {

    let [loginInfo, setLoginInfo] = useState({})
    let navigate = useNavigate()
    let isMobile = useMediaQuery('(max-width:600px)');
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)



    let login = async () => {
        setOpen(false)
        let requiredFields = ['email', 'password']
        for (let i; i < requiredFields.length; i++) {
            if (!(requiredFields[i] in Object.keys(loginInfo))) {
                console.log(`${requiredFields[i]} is missing`)
                setMessage(`${requiredFields[i]} is missing`)
                setOpen(true)
                return
            }
        }
        setOpen(false)
        try {
            let data = (await (await fetch(`${apiHost}/auth/login`,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json", },
                    body: JSON.stringify(loginInfo)
                }
            )).json())
            // console.log(data)
            if (data.status === "error") {
                setMessage(data.message)
                setOpen(true)
                return
            }
            else {
                setCookie("token", data.token, 1)
                setCookie("role", data.token, 1)
                if (window.localStorage.getItem("next_page")) {
                    window.localStorage.setItem("activeTab", "dashboard")
                    navigate(window.localStorage.getItem("next_page"))
                    window.localStorage.removeItem("next_page")
                    return
                }
                window.localStorage.setItem("activeTab", "dashboard")
                navigate('/')
                return
            }
        } catch (error) {
            setMessage(error)
            setOpen(true)
            return
        }

    }
    return (
        <>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                onClose={()=>{}}
                message={message}
                key={"loginAlert"}
            />

            <Box sx={{
                margin: "auto",
                alignContent: 'center', justifyContent: 'center', alignItems: 'center', width: (isMobile) ? '100%' : '50%',
                minWidth: (isMobile) ? '100%' : '50%',
                maxWidth: (isMobile) ? '100%' : '50%'
            }}>
                <br /><br /><br /><br />
                <img src="/landing_page.png" style={{ marginLeft: "42%", textAlign: "center" }} height="100px" alt="logo" />
                <br />
                <Typography variant="h5" sx={{ textAlign: "center", fontWeight: 'bold' }}>Login</Typography>

                <Container sx={{
                    padding: '3.5em', alignContent: 'center',
                    justifyContent: 'center', alignItems: 'center',
                    textAlign: 'center',
                    paddingTop: '2em'
                }}>
                    <TextField
                        sx={{ minWidth: "50%" }}
                        type="email"
                        label="Email Address"
                        placeholder="Email Address"
                        size="small"
                        onChange={e => { setLoginInfo({ ...loginInfo, email: e.target.value }) }}

                    />
                    <br /><br />
                    <TextField
                        type="password"
                        label="Password"
                        placeholder="Password"
                        sx={{ minWidth: "50%" }}
                        size="small"
                        onChange={e => { setLoginInfo({ ...loginInfo, password: e.target.value }) }}
                    />
                    <br />
                    <br />
                    <br />
                    <Button variant="contained"
                        disableElevation onClick={e => { login() }}
                        sx={{ width: "45%", backgroundColor: "#632165", borderRadius: "10px" }}>Login</Button>

                    <br />
                    <br />
                    <br />
                    <br />
                    <Typography sx={{ textDecoration: "underline", float: 'right', color: '#632165' }}
                        textAlign="center"
                    ><a href="/reset-password">Forgot Password?</a></Typography>
                    <br />


                </Container>

                {(!isMobile) && <><br /><br /><br /></>}


            </Box>
            {/* <Paper sx={{ backgroundColor: "#632165", color: 'white', minWidth: '100%' }}>
                <br />
                <br />
                <br />
            </Paper> */}
        </>
    )

}




