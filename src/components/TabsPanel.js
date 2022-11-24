import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box, Card, Typography } from '@mui/material';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 1 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs(tab1, tab2, tab3, labels, title) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Card variant="outlined" sx={{ p: 1, mt: 2, border: '1px solid grey' }}>
            <Box sx={{ m: 1, borderBottom: '1px solid grey' }}>
                <Typography gutterBottom variant="h4" component="div">
                    {title}
                </Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="Graph tabs"
                        variant="fullWidth"
                        allowScrollButtonsMobile
                        >
                        <Tab label={labels[0]} {...a11yProps(0)} />
                        <Tab label={labels[1]} {...a11yProps(1)} />
                        <Tab label={labels[2]} {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    {tab1}
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {tab2}
                </TabPanel>
                <TabPanel value={value} index={2}>
                    {tab3}
                </TabPanel>
            </Box>
        </Card>
    );
}
