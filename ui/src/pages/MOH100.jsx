import { Container, TextField, Stack, Button, Grid, Snackbar, Typography, Divider, useMediaQuery } from '@mui/material'
import { useEffect, useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getCookie } from '../lib/cookie'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, FormControl, InputLabel, Select, MenuItem, Card, CardContent } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import counties from '../data/counties.json'
import countyMap from '../data/code_to_counties_map.json'
import subCountyMap from '../data/code_to_constituencies_map.json'
import wardMap from '../data/code_to_wards_map.json'
import countyToConstituency from '../data/county_to_consituencies.json'
import consituencyToWard from '../data/consituencies_to_ward.json'
import consituencies from '../data/constituencies.json'
import wards from '../data/wards.json'
import {apiHost} from '../lib/api'


export default function MOH100({ id }) {

    let [referral, setReferral] = useState({})
    let navigate = useNavigate()
    let [selectedCounty, setCounty] = useState('')
    let [selectedSubCounty, setSubCounty] = useState('')
    let [open, setOpen] = useState(false)
    let [data, setData] = useState({})
    let [message, setMessage] = useState(false)
    let isMobile = useMediaQuery('(max-width:600px)');


    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    let createReferral = async () => {
        // setOpen(false)
        try {
            let fields = ['phone', 'firstName', 'lastName', 'reasonsForReferral', 'mainProblems', 'sex', 'dob', 'county', 'subCounty', 'ward']
            for (let f of fields) {
                if (Object.keys(referral).indexOf(f) < 0) {
                    setMessage(`${f} is a required field`)
                    setOpen(true)
                    return
                }
            }
            let county = countyMap[referral.county]
            let subCounty = subCountyMap[referral.subCounty]
            let ward = wardMap[referral.ward]
            // console.log(JSON.stringify(referral))
            let response = await (await fetch(`${apiHost}/referrals`,
                { method: "POST", body: JSON.stringify({...referral, county, subCounty, ward}), headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` } })).json()
            console.log(response)
            if (response.status === "success") {
                setOpen(true)
                setMessage("Referral created successfully")
                setTimeout(() => {
                    navigate('/community-referrals')
                }, 1500)
                return
            }
            setOpen(true)
            setMessage(response.error)
            return
        } catch (error) {
            setOpen(true)
            setMessage(JSON.stringify(error))
            return
        }
    }


    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                
                    <Container sx={{ border: '1px white dashed' }}>
                        <Snackbar
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                            open={open}
                            // onClose={""}
                            message={message}
                            key={"loginAlert"}
                        />
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList
                                    value={value}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example">
                                    <Tab label="SECTION A: Patient / Client Data" value="1" />
                                    <Tab label="SECTION B: Referral Back to the Community" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value='1'>
                                {/* <p></p> */}
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>SECTION A: Patient / Client Data</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="First Name"
                                            placeholder="First Name"
                                            size="small"
                                            onChange={e => { setReferral({ ...referral, firstName: e.target.value }) }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            label="Last Name"
                                            placeholder="Last Name"
                                            size="small"
                                            onChange={e => { setReferral({ ...referral, lastName: e.target.value }) }}
                                        // onChange={e=>{console.log(e)}}

                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Date of birth"
                                            inputFormat="MM/dd/yyyy"
                                            value={referral.dob || null}
                                            onChange={e => { setReferral({ ...referral, dob: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Date of birth"
                                                inputFormat="MM/dd/yyyy"
                                                value={referral.dob || null }
                                                onChange={e => { setReferral({ ...referral, dob: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Sex</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={referral.sex ? referral.sex : ""}
                                                label="Sex"
                                                onChange={e => { setReferral({ ...referral, sex: e.target.value }) }}
                                                size="small"
                                            >
                                                <MenuItem value={"Male"}>Male</MenuItem>
                                                <MenuItem value={"Female"}>Female</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            fullWidth
                                            type="tel"
                                            label="Phone Number"
                                            placeholder="Phone Number"
                                            size="small"
                                            onChange={e => { setReferral({ ...referral, phone: e.target.value }) }}

                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            multiline
                                            minRows={3}
                                            label="Reason(s) for Referral"
                                            placeholder="Reason(s) for Referral"
                                            size="small"
                                            onChange={e => { setReferral({ ...referral, reasonsForReferral: e.target.value }) }}

                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            multiline
                                            minRows={3}
                                            label="Main Problems"
                                            placeholder="Main Problems"
                                            size="small"
                                            onChange={e => { setReferral({ ...referral, mainProblems: e.target.value }) }}


                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            multiline
                                            minRows={3}
                                            label="Treatment Given"
                                            placeholder="Treatment Given"
                                            size="small"
                                            onChange={e => { setReferral({ ...referral, treatmentGiven: e.target.value }) }}


                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            multiline
                                            minRows={3}
                                            label="Comments"
                                            placeholder="Comments"
                                            size="small"
                                            onChange={e => { setReferral({ ...referral, comments: e.target.value }) }}


                                        />
                                    </Grid>
                                </Grid>

                                <Divider />
                                <p></p>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Residence</Typography>
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">County</InputLabel>
                                            <Select
                                                // defaultValue={32}
                                                label="County"
                                                onChange={e => { setReferral({ ...referral, county: e.target.value }); console.log(e.target.value) }}
                                                size="small"
                                            >
                                                {counties && counties.map((county) => {
                                                    return <MenuItem key={county.code} value={county.code}>{county.name}</MenuItem>

                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Sub-County</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label="Sub-County"
                                                onChange={e => { setReferral({ ...referral, subCounty: e.target.value }) }}
                                                size="small"
                                            >
                                                {referral.county && countyToConstituency[referral.county].map((subCounty) => {
                                                    return <MenuItem key={subCounty.code} value={subCounty.code}>{subCounty.name}</MenuItem>

                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Ward</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={referral.ward}
                                                label="Ward"
                                                onChange={e => { setReferral({ ...referral, ward: e.target.value }) }}
                                                size="small"
                                            >
                                                {referral.subCounty && consituencyToWard[referral.subCounty].map((ward) => {
                                                    return <MenuItem key={ward.code} value={ward.code}>{ward.name}</MenuItem>

                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={6}>
                                        <TextField
                                            fullWidth="100%"
                                            type="text"
                                            label="Street"
                                            placeholder="Street"
                                            size="small"
                                            onChange={e => { setReferral({ ...referral, street: e.target.value }) }}

                                        />
                                    </Grid>
                                </Grid>
                                <Divider />
                                <p></p>

                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' onClick={e => { setReferral({}) }} disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { createReferral() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>

                            </TabPanel>
                            <TabPanel value='2'>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>SECTION B: Referral back to the Community</Typography>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Call made by referring officer</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={data.callMadeByReferringOfficer ? data.callMadeByReferringOfficer : "No"}
                                                label="Call made by referring officer"
                                                onChange={e => { setReferral({ ...referral, callMadeByReferringOfficer: e.target.value }) }}

                                                size="small"
                                                defaultValue={"Yes"}
                                            >
                                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                                <MenuItem value={"No"}>No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={8}>
                                        <br />
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            readonly
                                            multiline
                                            minRows={3}
                                            label="Kindly do the following to the referral"
                                            placeholder="Kindly do the following to the referral"
                                            size="small"
                                            onChange={e => { console.log(e) }}

                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={8}>
                                        <br />
                                        <TextField
                                            fullWidth="80%"
                                            type="text"
                                            readonly
                                            multiline
                                            minRows={3}
                                            label="Signature"
                                            placeholder="Signature"
                                            size="small"
                                            // onChange={e=>{console.log(e)}}
                                            onChange={e => { setReferral({ ...referral, signature: e.target.value }) }}


                                        />
                                    </Grid>

                                </Grid>

                                <Grid container spacing={1} padding=".5em" >

                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { createReferral() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>
                            </TabPanel>
                            <TabPanel value='3'>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Registration</Typography>
                                <Divider />

                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>

                            </TabPanel>




                        </TabContext>
                    </Container>
                
            </LocalizationProvider>
        </>
    )

}




