import './styles/App.css';
import React, { useState } from 'react'
import StyledDropzone from './DndZone'
import { AllGraph } from './Graphs';
import RangeSlider from './DateSlider'
import ChatAnalysis from './ChatAnalysis';
import { Container, Stack, Typography, Link } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import UserInfo from './UserInfo';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [tinderData, setTinderData] = useState(false)
  //const [dateSelectedRange, setDateSelectedRange] = useState(false);
  const [dateRange, setDateRange] = useState(false)
  const [dateFilter, setDateFilter] = useState(false)

  function dataFromUpload(tinderData) {
    setTinderData(tinderData)
    setDateRange(Object.keys(tinderData.Usage.swipes_likes))
    setDateFilter([0, Object.keys(tinderData.Usage.swipes_likes).length - 1])
  }

  function dataFromSlider(dateFilter) {
    setDateFilter(dateFilter)
  }

  function loadSampleData() {
    fetch('sampleData.json')
      .then(response => response.json())
      .then(sampleData => {
        dataFromUpload(sampleData)
      });
  }

  if (!tinderData)
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Stack
            spacing={2}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}>
            <Typography>You can get your Tinder data from there: <Link href="https://account.gotinder.com/data">account.gotinder.com/data</Link></Typography>
            <div><StyledDropzone dataFromUpload={dataFromUpload} /></div>
            <Typography>Or load <Link onClick={loadSampleData} href="#">Sample Data</Link></Typography>
          </Stack>
        </Container>
      </ThemeProvider>
    );
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '10vh' }}>
          <RangeSlider dataFromSlider={dataFromSlider} dateRange={dateRange} />
          <UserInfo tinderData={tinderData} />
          <AllGraph tinderData={tinderData} dateFilter={dateFilter} />
          <ChatAnalysis tinderData={tinderData} dateFilter={dateFilter} />
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;
