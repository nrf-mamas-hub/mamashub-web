import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import {
  HealthAndSafety,
  BiotechRounded,
  Sick,
  ChildCare,
  AppRegistration,
  MedicationRounded,
  Vaccines,
  PestControlRounded,
  AccessTimeRounded,
  Bloodtype,
  MedicationLiquidRounded,
  Domain,
  LocalHospitalRounded,
  PeopleRounded,
  GroupsRounded,
  DescriptionRounded,
} from "@mui/icons-material";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "../lib/cookie";
import { Tooltip, IconButton, Avatar, Button, Container } from "@mui/material";
import {
  PivotTableChart,
  Dashboard,
  FamilyRestroom,
  People,
  Settings,
  EscalatorWarning,
  DocumentScanner,
  ExpandLess,
  ExpandMore,
  Edit,
  DescriptionOutlined,
  BallotRounded,
  PregnantWomanRounded,
} from "@mui/icons-material";
import Menu from "@mui/material/Menu";
import { MenuItem } from "@mui/material";
import { apiHost } from "../lib/api";
import { makeStyles, createStyles } from "@mui/styles";
import appRoutes from "../routes";
const drawerWidth = 250;

const useStyles = makeStyles((theme) =>
  createStyles({
    appMenu: {
      width: "100%",
    },
    navList: {
      width: drawerWidth,
    },
    menuItem: {
      width: drawerWidth,
    },
    menuItemIcon: {
      color: "#97c05c",
    },
  })
);

export default function HeaderDrawer({ children }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(null);
  const [userData, setUserData] = useState(null);

  function handleClick(item) {
    setOpen(open === item ? null : item);
  }

  let title = "Mama's Hub";
  let navigate = useNavigate();
  let [role, setRole] = useState(getCookie("role"));
  const settings = [{ "My Account": "/account" }, { Logout: "/logout" }];
  let pages = settings;
  let [activeTab, setActiveTab] = useState("dashboard");

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
    return;
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
    return;
  };

  let getProfile = async () => {
    let { data } = await (
      await fetch(`${apiHost}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
    ).json();
    setUserData(data);
    setRole(data.role);
    setCookie("role", data.role, 1 / 60);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    return;
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    return;
  };

  useEffect(() => {
    let token = getCookie("token");
    if (token) {
      getProfile();
      return;
    } else {
      navigate("/login");
      // window.localStorage.setItem("next_page", "/")
      return;
    }
  }, []);

  let isActiveTab = (tab) => {
    return tab === activeTab;
  };

  let activateTab = (tab) => {
    window.localStorage.setItem("activeTab", tab);
    return;
  };

  useEffect(() => {
    setActiveTab(window.localStorage.getItem("activeTab"));
  }, [window.localStorage.getItem("activeTab")]);

  const routes = [
    {
      name: "Dashboard",
      icon: <Dashboard />,
      path: "/",
      roles: ["FACILITY_ADMINISTRATOR", "NURSE"],
    },
    {
      name: "Client List",
      icon: <People />,
      path: "/patients",
      roles: ["NURSE"],
    },
    {
      name: "ANC Forms",
      icon: <i className="fa-solid fa-pen-to-square"></i>,
      roles: ["NURSE"],
      children: [
        {
          name: "Client Registration",
          icon: <i className="fa-solid fa-user-pen"></i>,
          path: "/patient-registration",
          roles: ["ADMINISTRATOR", "FACILITY_ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Antenatal Profile",
          icon: <DescriptionOutlined />,
          path: "/antenatal-profile",
          roles: ["ADMINISTRATOR", "FACILITY_ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Medical & Surgical History",
          icon: <MedicationRounded />,
          path: "/medical-surgical-history",
          roles: ["ADMINISTRATOR", "FACILITY_ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Physical Examination",
          icon: <BiotechRounded />,
          path: "/physical-examination",
          roles: ["ADMINISTRATOR", "FACILITY_ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Birth Plan",
          icon: <BallotRounded />,
          path: "/birth-plan",
          roles: ["ADMINISTRATOR", "FACILITY_ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Previous Pregnancy",
          icon: <PregnantWomanRounded />,
          path: "/previous-pregnancy",
          roles: ["ADMINISTRATOR", "FACILITY_ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Present Pregnancy",
          icon: <AccessTimeRounded />,
          path: "/present-pregnancy",
          roles: ["ADMINISTRATOR", "FACILITY_ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Tetanus & Diptheria",
          icon: <Vaccines />,
          path: "/tetanus-diptheria",
          roles: ["ADMINISTRATOR", "FACILITY_ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Malaria Prophylaxis",
          icon: <i className="fa-solid fa-mosquito-net"></i>,
          path: "/malaria-prophylaxis",
          roles: ["ADMINISTRATOR", "FACILITY_ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Maternal Serology",
          icon: <Bloodtype />,
          path: "/maternal-serology",
          roles: ["ADMINISTRATOR", "FACILITY_ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Deworming",
          icon: <i className="fa-solid fa-pills"></i>,
          path: "/deworming",
          roles: ["ADMINISTRATOR", "FACILITY_ADMINISTRATOR", "NURSE"],
        },
        {
          name: "IFAS",
          icon: <MedicationLiquidRounded />,
          path: "/ifas",
          roles: ["ADMINISTRATOR", "FACILITY_ADMINISTRATOR", "NURSE"],
        },
        {
          name: "PMTCT Interventions",
          icon: <LocalHospitalRounded />,
          path: "/pmtct-interventions",
          roles: ["ADMINISTRATOR", "FACILITY_ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Counselling",
          icon: <PeopleRounded />,
          path: "/counselling",
          roles: ["ADMINISTRATOR", "FACILITY_ADMINISTRATOR", "NURSE"],
        },
        {
          name: "CHW Referrals",
          icon: <i className="fa-solid fa-circle-nodes"></i>,
          path: "/community-referrals",
          roles: ["ADMINISTRATOR", "FACILITY_ADMINISTRATOR", "NURSE"],
        },
      ],
    },
    {
      name: "PNC Forms",
      icon: <i className="fa-solid fa-pen-to-square"></i>,
      roles: ["NURSE"],
      children: [
        {
          name: "Childbirth",
          icon: <i className="fa-solid fa-baby"></i>,
          path: "/childbirth",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Child Civil Registration",
          icon: <i className="fa-solid fa-user-plus"></i>,
          path: "/child-civil-registration",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Early Identification of Congenital Abnormalities",
          icon: <HealthAndSafety/>,
          path: "/early-identification-of-congenital-abnormalities",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Reproductive Organs Cancer Screening",
          icon: <i className="fa-solid fa-ribbon"></i>,
          path: "/reproductive-organs-cancer-screening",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Family Planning",
          icon: <FamilyRestroom />,
          path: "/family-planning",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Mother Postnatal Care",
          icon: <EscalatorWarning />,
          path: "/mother-postnatal-care",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Child Postnatal Care",
          icon: <EscalatorWarning />,
          path: "/child-postnatal-care",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Reason For Special Care",
          icon: <i className='fa-solid fa-notes-medical' ></i>,
          path: "/reason-for-special-care",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Feeding Information",
          icon: <i className="fa-solid fa-person-breastfeeding"></i>,
          path: "/feeding-information",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Baby Problems",
          icon: <Sick />,
          icon: <Sick />,
          path: "/other-baby-problems",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Record of Baby Teeth Development",
          icon: <ChildCare />,
          icon: <ChildCare />,
          path: "/baby-teeth-development",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Broad Clinical Review",
          icon: <i class="fa-solid fa-stethoscope"></i>,
          path: "/broad-clinical-review",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Developmental Milestones",
          icon: <i class="fa-solid fa-shoe-prints"></i>,
          path: "/developmental-milestones",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Identification of Early Eye Problems",
          icon: <i class="fa-solid fa-eye"></i>,
          path: "/identification-of-early-eye-problems",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Broad Clinical Review",
          icon: <i class="fa-solid fa-stethoscope"></i>,
          path: "/broad-clincial-review",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Developmental Milestones",
          icon: <i class="fa-solid fa-shoe-prints"></i>,
          path: "/developmental-milestones",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Identification of Early Eye Problems",
          icon: <i class="fa-solid fa-eye"></i>,
          path: "/identification-of-early-eye-problems",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        }

      ],
    },
    {
      name: "Immunization Forms",
      icon: <i class="fa-solid fa-syringe"></i>,
      roles: ["NURSE"],
      children: [
        {
          name: "BCG Vaccine",
          icon: <i class="fa-solid fa-shield-virus"></i>,
          path: "/bcg-vaccine",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Polio Vaccine",
          icon: <i class="fa-solid fa-eye-dropper"></i>,
          path: "/polio-vaccine",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "IPV (Inactivated Polio Vaccine)",
          icon: <i class="fa-solid fa-shield-virus"></i>,
          path: "/ipv",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Diptheria/Pertussis",
          icon: <i class="fa-solid fa-shield-virus"></i>,
          path: "/diptheria-vaccine",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Pneumococcal Conjugate Vaccine",
          icon: <i class="fa-solid fa-shield-virus"></i>,
          path: "/pneumococcal-conjugate-vaccine",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Rota Virus Vaccine",
          icon: <i class="fa-solid fa-eye-dropper"></i>,
          path: "/rota-virus-vaccine",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Measles Rubella Vaccine",
          icon: <i class="fa-solid fa-shield-virus"></i>,
          path: "/measles-rubella-vaccine",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Yellow Fever Vaccine",
          icon: <i class="fa-solid fa-shield-virus"></i>,
          path: "/yellow-fever-vaccine",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Other Vaccines",
          icon: <i class="fa-solid fa-vials"></i>,
          path: "/other-vaccines",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "AEFI",
          icon: <i class="fa-solid fa-hand-dots"></i>,
          path: "/any-adverse-event",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        }
      ]
    },
    {
      name: "Immunization Forms",
      icon: <i class="fa-solid fa-syringe"></i>,
      roles: ["NURSE"],
      children: [
        {
          name: "BCG Vaccine",
          icon: <i class="fa-solid fa-shield-virus"></i>,
          path: "/bcg-vaccine",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Polio Vaccine",
          icon: <i class="fa-solid fa-eye-dropper"></i>,
          path: "/polio-vaccine",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "IPV (Inactivated Polio Vaccine)",
          icon: <i class="fa-solid fa-shield-virus"></i>,
          path: "/ipv",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Diptheria/Pertussis",
          icon: <i class="fa-solid fa-shield-virus"></i>,
          path: "/diptheria-vaccine",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Pneumococcal Conjugate Vaccine",
          icon: <i class="fa-solid fa-shield-virus"></i>,
          path: "/pneumococcal-conjugate-vaccine",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Rota Virus Vaccine",
          icon: <i class="fa-solid fa-eye-dropper"></i>,
          path: "/rota-virus-vaccine",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Measles Rubella Vaccine",
          icon: <i class="fa-solid fa-shield-virus"></i>,
          path: "/measles-rubella-vaccine",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Yellow Fever Vaccine",
          icon: <i class="fa-solid fa-shield-virus"></i>,
          path: "/yellow-fever-vaccine",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "Other Vaccines",
          icon: <i class="fa-solid fa-vials"></i>,
          path: "/other-vaccines",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        },
        {
          name: "AEFI",
          icon: <i class="fa-solid fa-hand-dots"></i>,
          path: "/any-adverse-event",
          roles: ["ADMINISTRATOR", "FACILITY ADMINISTRATOR", "NURSE"],
        }
      ]
    },
    {
      name: "Reports",
      icon: <DescriptionRounded />,
      path: "/reports",
      roles: ["FACILITY_ADMINISTRATOR", "NURSE"],
      children: [
        {
          name: "MOH 405",
          icon: <PivotTableChart />,
          path: "/moh-reports",
          roles: ["FACILITY_ADMINISTRATOR", "NURSE"],
        },
        {
          name: "MOH 711",
          icon: <PivotTableChart />,
          path: "/moh-711",
          roles: ["FACILITY_ADMINISTRATOR", "NURSE"],
        },
      ],
    },
    {
      name: "Users",
      icon: <People />,
      path: "/users",
      roles: ["ADMINISTRATOR", "FACILITY_ADMINISTRATOR"],
    },
    {
      name: "Facilities",
      icon: <Domain />,
      path: "/facilities",
      roles: ["ADMINISTRATOR"],
    },
    {
      name: "Account & Settings",
      icon: <Settings />,
      path: "/account",
      roles: ["ADMINISTRATOR", "FACILITY_ADMINISTRATOR", "NURSE"],
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#632165",
        }}
        elevation={0}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img
              onClick={(e) => {
                navigate("/");
              }}
              src="/landing_page.png"
              height="50px"
              alt="logo"
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
              onClick={(e) => {
                navigate("/");
              }}
            >
              {title}
            </Typography>
            <Box
              sx={{ flexGrow: 1, display: { xs: "flex", md: "inline-block" } }}
            ></Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
              onClick={(e) => {
                navigate("/");
              }}
            >
              {title}
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={Object.keys(page)[0]}
                  onClick={(e) => {
                    navigate(`${page[Object.keys(page)[0]]}`);
                    handleCloseNavMenu();
                  }}
                  sx={{ my: 2, color: "#632165", display: "block" }}
                >
                  {Object.keys(page)[0]}
                </Button>
              ))}
            </Box>
            {getCookie("token") ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={Object.keys(setting)[0]}
                      onClick={handleCloseNavMenu}
                    >
                      <Typography
                        textAlign="center"
                        onClick={(e) => {
                          navigate(`${setting[Object.keys(setting)[0]]}`);
                        }}
                      >
                        {Object.keys(setting)[0]}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : (
              <Button
                variant="outlined"
                onClick={(e) => {
                  navigate("/login");
                }}
                sx={{ color: "white", "&:hover": { backgroundColor: "gray" } }}
              >
                LOGIN
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          backgroundColor: "#632165",
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            overflow: "auto",
            backgroundColor: "#632165",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <List>
            {role &&
              routes
                .filter((item) => item.roles.includes(role))
                .map((route, index) =>
                  route.children ? (
                    <React.Fragment key={route.name}>
                      <ListItem
                        onClick={() => handleClick(index)}
                        sx={{
                          backgroundColor: isActiveTab(route.name)
                            ? "white"
                            : "#632165",
                          color: isActiveTab(route.name) ? "#632165" : "white",
                          "&:hover": { backgroundColor: "gray" },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: isActiveTab(route.name)
                              ? "#632165"
                              : "white",
                          }}
                        >
                          {route.icon}
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{ fontSize: "13px" }}
                          primary={route.name}
                        />
                        {open === index ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse
                        in={open === index}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Divider />
                        <List disablePadding>
                          {route.children
                            .filter((item) => item.roles.includes(role))
                            .map((form) => (
                              <ListItem
                                button
                                key={form.name}
                                onClick={(e) => {
                                  navigate(form.path);
                                  activateTab(form.name);
                                }}
                                sx={{
                                  backgroundColor: isActiveTab(form.name)
                                    ? "white"
                                    : "#632165",
                                  marginLeft: "10px",
                                  color: isActiveTab(form.name)
                                    ? "#632165"
                                    : "white",
                                  "&:hover": { backgroundColor: "gray" },
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    color: isActiveTab(form.name)
                                      ? "#632165"
                                      : "white",
                                  }}
                                >
                                  {form.icon}
                                </ListItemIcon>
                                <ListItemText
                                  primaryTypographyProps={{ fontSize: "13px" }}
                                  primary={form.name}
                                />
                              </ListItem>
                            ))}
                        </List>
                      </Collapse>
                    </React.Fragment>
                  ) : (
                    <ListItem
                      sx={{
                        backgroundColor: isActiveTab(route.name)
                          ? "white"
                          : "#632165",
                        color: isActiveTab(route.name) ? "#632165" : "white",
                        "&:hover": { backgroundColor: "gray" },
                      }}
                      key={route.name}
                      onClick={(e) => {
                        navigate(`${route.path}`);
                        activateTab(route.name);
                        handleCloseNavMenu();
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: isActiveTab(route.name) ? "#632165" : "white",
                        }}
                      >
                        {route.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={route.name}
                        primaryTypographyProps={{ fontSize: "13px" }}
                      />
                    </ListItem>
                  )
                )}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <br />
        <br />
        <br />
        <Container>
          <Routes>
            {userData &&
              appRoutes.map((route, index) => (
                <Route
                  path={route.path}
                  key={index}
                  element={<route.element userData={userData} />}
                />
              ))}
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}
