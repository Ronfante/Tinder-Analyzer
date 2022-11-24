import * as React from 'react';
import { Slider, Box, Typography } from '@mui/material';


export default function WordSlider({ dataFromSlider, wordRange }) {
    const [value, setValue] = React.useState(wordRange)

    const handleChangeSet = (event, newValue) => {
        setValue(newValue);
        dataFromSlider(newValue)
    };

    return (
        <Box sx={{ ml: 3, mr: 3 }}>
            <Typography gutterBottom variant="body" component="div" >
                
            </Typography>
            <Slider
                getAriaLabel={() => 'Word range'}
                value={value}
                onChange={handleChangeSet}
                valueLabelDisplay="auto"
                max={wordRange[1]}
                min={1}
            />
        </Box>
    );

}