import { Container, TextField, Stack, Button, Grid, Snackbar, Typography, Divider, useMediaQuery, Radio, RadioGroup, Alert, FormControlLabel, FormLabel } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getCookie } from '../lib/cookie'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, FormControl, InputLabel, Select, MenuItem, } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CurrentPatient from '../components/CurrentPatient'


export default function Treatment() {

    let [patient, setPatient] = useState({})
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [notes, setNotes] = useState('')
    let preventiveServicesList = {
        "1st injection": "First visit",
        "2nd injection": "4 weeks after 1st dose but 2 weeks before childbirth",
        "3rd injection": "6 months after 2nd dose",
        "4th injection": "1 year after 3rd injection / subsequent pregnancy",
        "5th injection": "1 year after 4th injection / subsequent pregnancy"
    }
    let malariaProphylaxisList = {
        "Upto 12 weeks": "-",
        "13-16 weeks": "IPTp - SP dose 1",
        "20 weeks": "IPTp - SP dose 2",
        "26 weeks": "IPTp - SP dose 3",
        "30 weeks": "IPTp - SP dose 4",
        "34 weeks": "IPTp - SP dose 5",
        "36 weeks": "No SP, if last dose received <1 Month ago",
        "38 weeks": "IPTp - SP dose 6 (if no dose in past month)",
        "40 weeks": "-"
    }

    let ifasList = {
        "0 - Upto 12 weeks gestation": "60 tablets",
        "1 - 12 weeks gestation": "56 tablets",
        "2 - 20 weeks gestation": "42 tablets",
        "3 - 26 weeks gestation": "28 tablets",
        "4 - 30 weeks gestation": "28 tablets",
        "5 - 34 weeks gestation": "14 tablets",
        "6 - 36 weeks gestation": "14 tablets",
        "7 - 38 weeks gestation": "14 tablets",
        "8 - 40 weeks gestation": "14 tablets",
    }

   
    let [serologyList, setSerologyList] = useState([])
    let [malariaProphylaxis, setMalariaProphylaxis] = useState()
    let [preventiveServiceList, setPreventiveServiceList] = useState([])
    let [visit, setVisit] = useState()
    let [notesDisplay, setNotesDisplay] = useState('')
    let [data, setData] = useState({})
    let [preventiveServices, setPreventiveServices] = useState({})
    let [preventiveService, setPreventiveService] = useState(null)
    let [maternalSerology, setMaternalSerology] = useState({})
    let [ifas, setIfas] = useState()
    let [message, setMessage] = useState(false)
    let isMobile = useMediaQuery('(max-width:600px)');

    const [value, setValue] = useState('1');
 
    let saveSerologyResults = async () => {


        return
    }

    let saveSuccessfully = async () => {
        setMessage("Data saved successfully")
        setOpen(true)
        setTimeout(() => {
            setOpen(false)
        }, 2000)
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    useEffect(() => {
        let visit = window.localStorage.getItem("currentPatient")
        if (!visit) { return }
        setVisit(JSON.parse(visit))
        return
    }, [])


    let saveObservation = async (patientId, code, observationValue) => {
        let response = await (await fetch('/crud/observations', {
            body: JSON.stringify({})
        }))

        return
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
                        {visit && <CurrentPatient data={visit} />}

                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList
                                    value={value}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example">

                                    <Tab label="Preventive Services" value="1" />
                                    <Tab label="Malaria Prophylaxis" value="2" />
                                    <Tab label="Maternal Serology" value="3" />
                                    <Tab label="IFAS" value="4" />
                                    <Tab label="PMTCT Interventions" value="5" />

                                </TabList>
                            </Box>

                            {/* Preventive Services  */}
                            <TabPanel value='1'>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Preventive Services</Typography>
                                <Divider />
                                {preventiveService && <><p></p>
                                    <Alert severity="info">{preventiveService}</Alert>
                                    <p></p>
                                </>}
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={8}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Tetanus Diphtheria (TD) injection</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={preventiveService ? preventiveService : ""}
                                                label="Tetanus Diphtheria (TD) injection"
                                                onChange={e => { setPreventiveService(e.target.value); console.log(e.target.value) }}
                                                size="small"
                                            >
                                                {Object.keys(preventiveServicesList).map((service) => {
                                                    return <MenuItem value={preventiveServicesList[service]}>{service}</MenuItem>

                                                })}
                                            </Select>
                                        </FormControl>

                                    </Grid>
                                </Grid>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Date given"
                                            inputFormat="MM/dd/yyyy"
                                            value={preventiveServices.dateGiven ? preventiveServices.dateGiven : null}
                                            onChange={e => { setPreventiveServices({ ...preventiveServices, dateGiven: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Date given"
                                                inputFormat="MM/dd/yyyy"
                                                value={preventiveServices.dateGiven ? preventiveServices.dateGiven : null}
                                                onChange={e => { setPreventiveServices({ ...preventiveServices, dateGiven: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Next visit"
                                            inputFormat="MM/dd/yyyy"
                                            value={preventiveServices.nextVisitDate || null}
                                            onChange={e => { setPreventiveServices({ ...preventiveServices, nextVisitDate: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Next visit"
                                                inputFormat="MM/dd/yyyy"
                                                value={preventiveServices.nextVisitDate || null}
                                                onChange={e => { setPreventiveServices({ ...preventiveServices, nextVisitDate: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>

                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { saveSuccessfully() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>
                            </TabPanel>

                            {/* Malaria Prophylaxis */}
                            <TabPanel value='2'>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Malaria Prophylaxis</Typography>
                                <Divider />
                                {malariaProphylaxis && <><p></p>
                                    <Alert severity="info">{malariaProphylaxis}</Alert>
                                    <p></p>
                                </>}

                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={8}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Timing of Contact</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={malariaProphylaxis ? malariaProphylaxis : ""}
                                                label="Timing of contact"
                                                placeholder='Timing of contact'
                                                onChange={e => { setMalariaProphylaxis(e.target.value); console.log(e.target.value) }}
                                                size="small"
                                            >
                                                {Object.keys(malariaProphylaxisList).map((service) => {
                                                    return <MenuItem value={malariaProphylaxisList[service]}>{service}</MenuItem>

                                                })}
                                            </Select>
                                        </FormControl>

                                    </Grid>
                                </Grid>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Date given"
                                            inputFormat="MM/dd/yyyy"
                                            value={preventiveServices.dateGiven ? preventiveServices.dateGiven : null}
                                            onChange={e => { setPreventiveServices({ ...preventiveServices, dateGiven: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Date given"
                                                inputFormat="MM/dd/yyyy"
                                                value={preventiveServices.dateGiven ? preventiveServices.dateGiven : null}
                                                onChange={e => { setPreventiveServices({ ...preventiveServices, dateGiven: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Next visit"
                                            inputFormat="MM/dd/yyyy"
                                            value={preventiveServices.nextVisitDate || null}
                                            onChange={e => { setPreventiveServices({ ...preventiveServices, nextVisitDate: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Next visit"
                                                inputFormat="MM/dd/yyyy"
                                                value={preventiveServices.nextVisitDate || null}
                                                onChange={e => { setPreventiveServices({ ...preventiveServices, nextVisitDate: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>

                                </Grid>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Long lasting Insecticide Treated Net (LLITN)"
                                            inputFormat="MM/dd/yyyy"
                                            value={preventiveServices.llitn ? preventiveServices.llitn : null}
                                            onChange={e => { setPreventiveServices({ ...preventiveServices, llitn: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Long lasting Insecticide Treated Net (LLITN)"
                                                inputFormat="MM/dd/yyyy"
                                                value={preventiveServices.llitn ? preventiveServices.llitn : null}
                                                onChange={e => { setPreventiveServices({ ...preventiveServices, llitn: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Deworming (Mebendazole 500mgs)"
                                            inputFormat="MM/dd/yyyy"
                                            value={preventiveServices.deworming ? preventiveServices.deworming : null}
                                            onChange={e => { setPreventiveServices({ ...preventiveServices, deworming: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Deworming (Mebendazole 500mgs)"
                                                inputFormat="MM/dd/yyyy"
                                                value={preventiveServices.deworming ? preventiveServices.deworming : null}
                                                onChange={e => { setPreventiveServices({ ...preventiveServices, deworming: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                </Grid>
                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { saveSuccessfully() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>
                            </TabPanel>
                            <TabPanel value='3'>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Maternal Serology</Typography>
                                <Divider />
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={12}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            onChange={e => { console.log(e) }}
                                        >

                                            <FormControlLabel value={0} sx={{ width: "50%" }} control={<FormLabel />} label="Serology Results: " />
                                            <FormControlLabel value={"reactive"} control={<Radio />} label="Reactive" />
                                            <FormControlLabel value={"non-reactive"} control={<Radio />} label="Non-Reactive" />
                                            <FormControlLabel value={"not-tested"} control={<Radio />} label="Not Tested" />
                                        </RadioGroup>

                                    </Grid>
                                </Grid>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Date test done"
                                            inputFormat="MM/dd/yyyy"
                                            value={maternalSerology.dateTestDone || null}
                                            onChange={e => { console.log(e); setMaternalSerology({ ...maternalSerology, dateTestDone: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Date test done"
                                                inputFormat="MM/dd/yyyy"
                                                value={maternalSerology.dateTestDone}
                                                onChange={e => { console.log(e); setMaternalSerology({ ...maternalSerology, dateTestDone: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Date of next appointment"
                                            inputFormat="MM/dd/yyyy"
                                            value={maternalSerology.dateOfNextAppointment}
                                            // onChange={e => { setReferral({ ...referral, dob: e }) }}
                                            onChange={e => { console.log(e); setMaternalSerology({ ...maternalSerology, dateOfNextAppointment: e }) }}

                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Date of next appointment"
                                                inputFormat="MM/dd/yyyy"
                                                value={maternalSerology.dateOfNextAppointment}
                                                // onChange={e => { setReferral({ ...referral, dob: e }) }}
                                                onChange={e => { console.log(e); setMaternalSerology({ ...maternalSerology, dateOfNextAppointment: e }) }}

                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>

                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { saveSuccessfully() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>
                            </TabPanel>
                            <TabPanel value='4'>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Iron and Folic Acid Supplementation</Typography>
                                <Divider />
                                {ifas && <><p></p>
                                    <Alert severity="info">{"Prescribe and dispense: " + ifas}</Alert>
                                    <p></p>
                                </>}
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={8}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Contacts</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={ifas ? ifas : ""}
                                                label="Iron and Folic Acid Supplementation"
                                                onChange={e => { setIfas(e.target.value); console.log(e.target.value) }}
                                                size="small"
                                            >
                                                {Object.keys(ifasList).map((service) => {
                                                    return <MenuItem value={ifasList[service]}>{service}</MenuItem>

                                                })}
                                            </Select>
                                        </FormControl>

                                    </Grid>
                                </Grid>
                                <Divider />
                                <p></p>
                                <Grid container spacing={1} padding=".5em" >

                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Date given"
                                            inputFormat="MM/dd/yyyy"
                                            value={preventiveServices.dateGiven ? preventiveServices.dateGiven : null}
                                            onChange={e => { setPreventiveServices({ ...preventiveServices, dateGiven: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Date given"
                                                inputFormat="MM/dd/yyyy"
                                                value={preventiveServices.dateGiven ? preventiveServices.dateGiven : null}
                                                onChange={e => { setPreventiveServices({ ...preventiveServices, dateGiven: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { saveSuccessfully() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>
                            </TabPanel>
                            {/* PMTCT Interventions */}
                            <TabPanel value='5'>
                                <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>PMTCT Interventions</Typography>
                                <Divider />
                                {ifas && <><p></p>
                                    <Alert severity="info">{"Prescribe and dispense: " + ifas}</Alert>
                                    <p></p>
                                </>}
                             
                                <p></p>
                                <Typography>ART for life</Typography>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            label="Regimen" size="small" type="number"
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Visit Date"
                                            inputFormat="MM/dd/yyyy"
                                            value={preventiveServices.dateGiven ? preventiveServices.dateGiven : new Date()}
                                            onChange={e => { setPreventiveServices({ ...preventiveServices, dateGiven: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Visit Date"
                                                inputFormat="MM/dd/yyyy"
                                                value={preventiveServices.dateGiven ? preventiveServices.dateGiven : new Date()}
                                                onChange={e => { setPreventiveServices({ ...preventiveServices, dateGiven: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                </Grid>
                                <p></p>

                                <Divider />
                                {/* {ifas && <><p></p>
                                    <Alert severity="info">{"Prescribe and dispense: " + ifas}</Alert>
                                    <p></p>
                                </>} */}

                                <p></p>
                                <Typography>Viral Load (VL) Sample</Typography>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={4}>
                                        <TextField
                                            label="Results" size="small" type="number"
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={12} lg={4}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="Date Viral load taken"
                                            inputFormat="MM/dd/yyyy"
                                            value={preventiveServices.dateGiven ? preventiveServices.dateGiven : new Date()}
                                            onChange={e => { setPreventiveServices({ ...preventiveServices, dateGiven: e }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="Date Viral load taken"
                                                inputFormat="MM/dd/yyyy"
                                                value={preventiveServices.dateGiven ? preventiveServices.dateGiven : new Date()}
                                                onChange={e => { setPreventiveServices({ ...preventiveServices, dateGiven: e }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>

                                </Grid>
                                <p></p>
                                <Divider />
                                <p></p>
                                <Stack direction="row" spacing={2} alignContent="right" >
                                    {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                    <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                    <Button variant="contained" onClick={e => { saveSuccessfully() }} disableElevation sx={{ backgroundColor: "#632165" }}>Save</Button>
                                </Stack>
                                <p></p>
                            </TabPanel>
                        </TabContext>
                    </Container>
                
            </LocalizationProvider>
        </>
    )

}




