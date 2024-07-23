import {
  Typography,
  Stack,
  TextField,
  Grid,
  Container,
  useMediaQuery,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as qs from "query-string";
import Layout from "../components/Layout";
import { getCookie } from "../lib/cookie";
import { apiHost, FhirApi } from "./../lib/api";

export default function NurseDashboard() {
  let [patients, setPatients] = useState();
  let navigate = useNavigate();
  let [data, setData] = useState({});
  let [role, setRole] = useState(null);
  let [facilities, setFacilities] = useState([]);

  // fetch dashboard stats
  let getStatistics = async () => {
    let data = (await FhirApi({ url: `/reports/anc-summary` })).data;
    setData(data.report);
    return;
  };

  let getProfile = async () => {
    let _data = await (
      await FhirApi({
        url: `/auth/me`,
      })
    ).data;
    setRole(_data.data.role);
    if (!(_data.data.role === "NURSE")) {
      navigate("/");
      return;
    }
    return;
  };

  let isMobile = useMediaQuery("(max-width:600px)");

  let args = qs.parse(window.location.search);

  useEffect(() => {
    if (getCookie("token")) {
      getProfile();
      getStatistics();
      return;
    } else {
      navigate("/login");
      window.localStorage.setItem("next_page", "/");
      return;
    }
  }, []);

  return (
    <>
      <br />
      <Container maxWidth="lg">
        {role === "NURSE" ? (
          <>
            <Typography variant="h5">Welcome </Typography>
            <Grid container spacing={1} padding=".5em">
              {Object.keys(data).length > 0 ? (
                Object.keys(data).map((entry) => {
                  return (
                    <Grid key={entry} item xs={12} md={12} lg={3}>
                      <StatCard
                        title={entry}
                        number={data[entry]}
                        bg="#D0ADFC"
                      />
                    </Grid>
                  );
                })
              ) : (
                <CircularProgress />
              )}
            </Grid>
          </>
        ) : (
          <CircularProgress />
        )}
      </Container>
    </>
  );
}

let StatCard = ({ number, title, bg }) => {
  return (
    <>
      <Card sx={{ backgroundColor: bg }}>
        <CardContent>
          <Typography variant="h3" sx={{ textAlign: "center" }}>
            {number}
          </Typography>
          <Typography variant="h6" sx={{ minHeight: "4.7em" }}>
            {title}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
