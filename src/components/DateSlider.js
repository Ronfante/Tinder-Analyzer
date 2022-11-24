import * as React from 'react';
import { Slider, Box, Card, Typography } from '@mui/material';


export default function RangeSlider({ dataFromSlider, dateRange }) {
    const [value, setValue] = React.useState([0, dateRange.length - 1])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeSet = (event, newValue) => {
        setValue(newValue);
        dataFromSlider(newValue)
    };

    return (
        <Card variant="outlined" sx={{ width: '100%', m: 2, border: '1px solid grey' }}>
            <Box sx={{ m: 1, borderBottom: '1px solid grey' }}>
                <Typography gutterBottom variant="h4" component="div" sx={{ m: 1 }}>
                    Range Selector
                </Typography>
            </Box>
            <Box
                component="div"
                p={2}
                alignItems="center"
                justifyContent="center"
                sx={{ ml: 5, mr: 5 }}
            >
                <Slider
                    getAriaLabel={() => 'Date range'}
                    value={value}
                    onChange={handleChange}
                    onChangeCommitted={handleChangeSet}
                    valueLabelDisplay="auto"
                    valueLabelFormat={valuetext}
                    max={dateRange.length - 1}
                />
            </Box>
        </Card>
    );

    function valuetext(value) {
        return dateRange[value];
    }
}