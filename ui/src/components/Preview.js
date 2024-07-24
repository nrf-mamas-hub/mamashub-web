import React from 'react';
import {
  Divider,
  Button,
  Grid,
  Typography,
  Box,
  Stack,
  useMediaQuery,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

export default function Preview({ title, format = {}, data, ...props }) {
  const sections = Object.keys(format);
  let isMobile = useMediaQuery('(max-width:600px)');

  const displayData = (data, field) => {
    if (field.type === 'date') {
      // console.log(data[field.name]);
      return data[field.name]
        ? new Date(data[field.name]).toLocaleDateString('en-GB')
        : '';
    }
    if (Array.isArray(data[field.name])) {
      return data[field.name].join(', ');
    }
    return data[field.name];
  };

  return (
    <>
      <TabContext value='1'>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            aria-label='scrollable auto tabs example'
            value='1'
          >
            <Tab label={title} value='1' />
          </TabList>
        </Box>
        <TabPanel value='1'>
          <Grid container spacing={2} padding='.5em'>
            {sections.map((section, index) => {
              return (
                <Grid key={index} item xs={12} md={12} lg={6}>
                  <Typography
                    variant='p'
                    sx={{ fontSize: 'large', fontWeight: 'bold' }}
                  >
                    {section}
                  </Typography>
                  <Divider />
                  <p></p>
                  <Grid container spacing={1} padding='.5em'>
                    {format[section].map((field, index) => {
                      return (
                        <Grid key={index} item xs={12} md={12} lg={12}>
                          {displayData(data, field) && (
                            <>
                              <Typography
                                variant='p'
                                sx={{ fontSize: 'small', fontWeight: 'bold' }}
                              >
                                {field.label}
                              </Typography>
                              :{' '}
                              <Typography
                                variant='p'
                                sx={{ fontSize: 'small' }}
                              >
                                {displayData(data, field)}
                              </Typography>
                            </>
                          )}
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
          <Stack direction='row' spacing={2} alignContent='right'>
            {!isMobile && <Typography sx={{ minWidth: '80%' }}></Typography>}
            <Button
              variant='contained'
              onClick={props.close}
              disableElevation
              sx={{ backgroundColor: '#632165' }}
            >
              Edit
            </Button>
            <Button
              variant='contained'
              onClick={() => props.submit(data)}
              disableElevation
              sx={{ backgroundColor: 'gray' }}
            >
              Save
            </Button>
          </Stack>
        </TabPanel>
      </TabContext>
    </>
  );
}
