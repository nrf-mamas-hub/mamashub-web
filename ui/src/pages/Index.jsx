import { Typography, Stack, TextField, Grid, Container, useMediaQuery, Card, CardContent, CircularProgress } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import Layout from '../components/Layout';
import { getCookie } from '../lib/cookie';
import { apiHost } from './../lib/api';

export default function Index() {
    let [patients, setPatients] = useState()
    let navigate = useNavigate();
    let [data, setData] = useState({});
    let [role, setRole] = useState(null);
    let [facilities, setFacilities] = useState([]);


    // fetch users
    let getFacilities = async () => {
        let data = (await (await fetch(`${apiHost}/admin/facilities`,
            { method: "GET", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` } })).json())
        setFacilities(data.facilities);
        return;
    }

    // fetch dashboard stats
    let getStatistics = async () => {
        let data = (await (await fetch(`${apiHost}/statistics/dashboard`,
            { method: "GET", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` } })).json())
        setData(data.data);
        return;
    }

    let getProfile = async () => {
        let _data = (await (await fetch(`${apiHost}/auth/me`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` }
            })).json());
        setRole(_data.data.role);
        if (_data.data.role === "NURSE") {
            navigate("/nurse-dashboard");
            return
        }
        return;
    }



    let isMobile = useMediaQuery('(max-width:600px)');

    let args = qs.parse(window.location.search);


    useEffect(() => {
        if (getCookie("token")) {
            getProfile();
            getStatistics();
            return;
        } else {
            navigate('/login');
            window.localStorage.setItem("next_page", "/");
            return;
        }
    }, []);


    return (
        <>
            
                <br />
                <Container maxWidth="lg">
                    {(role === "ADMINISTRATOR" || role === "FACILITY_ADMINISTRATOR") ? <>
                        <Typography variant="h5">Welcome </Typography>
                        <Grid container spacing={1} padding=".5em" >
                        {Object.keys(data).length > 0 && Object.keys(data).map((entry) => {
                            return <Grid key={entry} item xs={12} md={12} lg={3} >                                    
                                    <StatCard title={(entry).toUpperCase()} number={data[entry]} bg="#D0ADFC" />
                                </Grid>
                            })}
                        </Grid>
                    </> : <CircularProgress />}
                </Container>
            
        </>
    )

}


let StatCard = ({ number, title, bg }) => {

    return <>
        <Card sx={{ backgroundColor: bg }}>
            <CardContent>
                <Typography variant="h4">{number}</Typography>
                <Typography variant="h6">{title}</Typography>
            </CardContent>
        </Card>
    </>
}




