import * as React from 'react';
import { Box, Grid, Typography, Card, Avatar } from '@mui/material';
import { Cake, Male, Event } from '@mui/icons-material';

export default function UserInfo({ tinderData }) {
    return (
        <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xl={4} xs={12}>
                <Card variant="outlined" sx={{ border: '1px solid grey' }}>
                    <Box sx={{ m: 1, alignItems: "center", display: "inline-flex" }}>
                        <Avatar sx={{ bgcolor: "rgba(255, 99, 132, 0.8)", mr: 2 }}>
                            <Cake />
                        </Avatar>
                        <Typography gutterBottom variant="body1" component="div">
                            {new Date().getFullYear() - tinderData.User.birth_date.substring(0, 4)}
                        </Typography>
                    </Box>
                </Card>
            </Grid>
            <Grid item xl={4} xs={12}>
                <Card variant="outlined" sx={{ border: '1px solid grey' }}>
                    <Box sx={{ m: 1, alignItems: "center", display: "inline-flex" }}>
                        <Avatar sx={{ bgcolor: "rgba(53, 162, 235, 0.8)", mr: 2 }}>
                            <Male />
                        </Avatar>
                        <Typography gutterBottom variant="body1" component="div">
                            {tinderData.User.gender === 'M' ? "Male" : "Female"} interested in {tinderData.User.gender_filter === 'M' ? "Male" : "Female"}
                        </Typography>
                    </Box>
                </Card>
            </Grid>
            <Grid item xl={4} xs={12}>
                <Card variant="outlined" sx={{ border: '1px solid grey' }}>
                    <Box sx={{ m: 1, alignItems: "center", display: "inline-flex" }}>
                        <Avatar sx={{ bgcolor: "rgba(3, 62, 35, 0.8)", mr: 2 }}>
                            <Event />
                        </Avatar>
                        <Typography gutterBottom variant="body1" component="div">
                            {(new Date(tinderData.User.create_date)).toLocaleDateString("en-US")}
                        </Typography>
                    </Box>
                </Card>
            </Grid>
        </Grid>
    )
}