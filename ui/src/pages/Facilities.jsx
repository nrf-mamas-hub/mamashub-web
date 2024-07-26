import { useState, useEffect } from 'react';
import {
    Grid, TextField, Typography, Modal, Box, Stack, Button, Alert, useMediaQuery, MenuItem, Snackbar,
    FormControl, InputLabel, Select
} from '@mui/material';
import Layout from '../components/Layout';
import { getCookie } from './../lib/cookie';
import { useNavigate } from 'react-router';
import { DataGrid } from '@mui/x-data-grid';
import { apiHost } from '../lib/api';
import counties from '../data/counties.json';
import countyToConstituency from '../data/county_to_consituencies.json'
import consituencyToWard from '../data/consituencies_to_ward.json'

export default function Facilities() {

    let [facilities, setFacilities] = useState([]);
    let [open, setOpen] = useState(false);
    let [editMode, setEditMode] = useState(false);
    let [data, setData] = useState({});
    let [loading, setLoading] = useState(true);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    let [selected, setSelected] = useState([]);
    let isMobile = useMediaQuery('(max-width:600px)');
    let navigate = useNavigate();
    let [openSnackBar, setOpenSnackBar] = useState(false);
    let [message, setMessage] = useState(false);


    function prompt(text) {
        setMessage(text);
        setOpenSnackBar(true);
        setTimeout(() => {
            setOpenSnackBar(false);
        }, 4000);
        return;
    }

    // fetch facilities
    let getFacilities = async () => {
        try {
            let data = (await (await fetch(`${apiHost}/admin/facilities`,
                { method: "GET", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` } })).json());
            setFacilities(data.facilities);
            setLoading(false);
            prompt("Loaded facilites successfully");
            return;
        } catch (error) {
            prompt(JSON.stringify(error));
            return;
        }
    }

    // delete users
    let deleteFacilities = async () => {
        for (let i of selected) {
            setOpenSnackBar(false)
            let response = (await (await fetch(`${apiHost}/admin/facilities/${i}`,
                {
                    method: "DELETE", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` }
                })).json())
            if (response.status === "error") {
                prompt(response.error || response.message)
                return;
            }
            getFacilities();
            setOpen(false);
        }
        return
    }

    // create user
    let createFacility = async () => {

        let requiredFields = ["kmhflCode", "country", "name", "subCounty", "ward"];
        for (let i; i < requiredFields.length; i++) {
            if (Object.keys(data).indexOf(requiredFields[i]) < 0) {
                prompt(`${requiredFields[i]} is required`);
                return;
            }
        }
        console.log(data)
        // return;

        setOpenSnackBar(false);
        let response = (await (await fetch(`${apiHost}/admin/facilities`,
            {
                method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` },
                body: JSON.stringify({
                    kmhflCode: data.kmhflCode, county: counties[data.county - 1].name, "name": data.name, subCounty: countyToConstituency[data.county].map((sc) => {
                        console.log(sc)
                        if (sc.code === data.subCounty) {
                            return sc.name
                        }
                    }), ward: data.ward, status: data.status
                })
            })).json())
        if (response.status === "error") {
            setMessage(response.error || response.message)
            setOpenSnackBar(true);
            return;
        }
        getFacilities();
        setOpen(false);
        return;
    }
    // edit user
    let editFacility = async () => {
        setOpenSnackBar(false)
        let _subCounty = countyToConstituency[data.county].map((sc) => {
            // console.log(sc)
            if (sc.code === data.subCounty) {
                return sc.name
            }
        })
        console.log(_subCounty)
        let response = (await (await fetch(`${apiHost}/admin/facilities/${selected[0]}`,
            {
                method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` },
                body: JSON.stringify({
                    status: data.status, county: counties[data.county - 1].name, "name": data.name, subCounty: _subCounty.filter(n => n)[0], ward: data.ward
                })
            })).json());
        if (response.status === "error") {
            setMessage(response.error || response.message);
            setOpenSnackBar(true);
            return
        }
        prompt(`Successfully created user`);
        getFacilities();
        setOpen(false);
        return;
    }

    useEffect(() => {
        if (getCookie("token")) {
            getFacilities();
            return;
        } else {
            navigate('/login');
            window.localStorage.setItem("next_page", "/facilities");
            return;
        }
    }, [])

    const columns = [
        { field: 'kmhflCode', headerName: 'KMHFL Code', width: 150 },
        { field: 'name', headerName: 'Facility Name', width: 200 },
        { field: 'county', headerName: 'County', width: 150 },
        { field: 'subCounty', headerName: 'Sub-County', width: 150 },
        { field: 'ward', headerName: 'Ward', width: 150 },
        { field: 'disabled', headerName: 'Disabled', width: 150 },
    ];

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <>
            
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={openSnackBar}
                    onClose={()=>{}}
                    message={message}
                    key={"loginAlert"}
                />
                <Stack direction="row" spacing={2} alignContent="right" >
                    {(!isMobile) && <Typography sx={{ minWidth: (selected.length > 1) ? '60%' : (selected.length === 1) ? "43%" : '80%' }}></Typography>}

                    {(selected.length > 0) &&
                        <>
                            <Button variant="contained" onClick={e => { deleteFacilities() }} disableElevation sx={{ backgroundColor: '#632165' }}>Delete {(selected.length > 1) ? `Facilities` : 'Facility'}</Button>
                        </>
                    }
                    {(selected.length === 1) &&
                        <>
                            <Button variant="contained" disableElevation sx={{ backgroundColor: "#632165" }} onClick={e => { setEditMode(true); handleOpen() }}>Edit Facility Details</Button>
                            {/* <Button variant="contained" disableElevation sx={{ backgroundColor: "#632165" }} onClick={e => { resetPassword() }}>Reset Password</Button> */}
                        </>
                    }

                    <Button variant="contained" disableElevation sx={{ backgroundColor: "#632165" }} onClick={handleOpen}>Add New Facility</Button>
                </Stack>
                <p></p>
                <DataGrid
                    getRowId={(row) => row.kmhflCode}
                    loading={loading}
                    rows={facilities ? facilities : []}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    autoHeight
                    disableSelectionOnClick
                    onSelectionModelChange={e => { setSelected(e) }}
                    onCellEditStop={e => { console.log(e) }}
                />
                {/* Add User Modal  */}
                <Modal
                    keepMounted
                    open={open}
                    onClose={handleClose}
                >
                    <Box sx={style}>
                        <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                            {editMode ? "Update Facility Information" : "Add New Facility"}
                        </Typography>
                        <Typography variant="p">Provide facility information below</Typography>
                        <br /><br />
                        <Stack direction="column" spacing={2}>
                            <TextField
                                sx={{ width: "100%" }}
                                type="text"
                                label="KMHFL Code"
                                placeholder="KMHFL Code"
                                size="small"
                                onChange={e => { setData({ ...data, kmhflCode: e.target.value }) }}
                            />
                            <TextField
                                sx={{ width: "100%" }}
                                type="email"
                                label="Facility Name"
                                placeholder="Facility Name"
                                size="small"
                                onChange={e => { setData({ ...data, name: e.target.value }) }}
                            />
                            <Grid item xs={12} md={12} lg={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">County</InputLabel>
                                    <Select
                                        // defaultValue={null}
                                        label="County"
                                        onChange={e => { setData({ ...data, county: e.target.value }); console.log(e.target.value) }}
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
                                        value={data.constituency}
                                        label="Sub-County"
                                        onChange={e => { setData({ ...data, subCounty: e.target.value }) }}
                                        size="small"
                                    >
                                        {data.county && countyToConstituency[data.county].map((subCounty) => {
                                            return <MenuItem key={subCounty.code} value={subCounty.code}>{subCounty.name}</MenuItem>

                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={12} lg={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Ward</InputLabel>
                                    <Select
                                        value={data.ward}
                                        label="Ward"
                                        onChange={e => { setData({ ...data, ward: e.target.value }) }}

                                        size="small"
                                    >
                                        {data.subCounty && consituencyToWard[data.subCounty].map((ward) => {
                                            return <MenuItem key={ward.code} value={ward.code}>{ward.name}</MenuItem>

                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {editMode && <Grid item xs={12} md={12} lg={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                    <Select
                                        value={data.status}
                                        label="Ward"
                                        onChange={e => { setData({ ...data, status: e.target.value }) }}

                                        size="small"
                                    >
                                        <MenuItem value={"disabled"}>DISABLED</MenuItem>
                                        <MenuItem value={"enabled"}>ENABLED</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>}
                            <Button variant='contained' sx={{ backgroundColor: "#632165" }} onClick={e => { editMode ? editFacility() : createFacility() }}>{editMode ? "Update" : "Create"} Facility</Button>
                            <br />
                        </Stack>
                    </Box>
                </Modal>
            
        </>
    )
}