import * as React from 'react';
import { Box, Grid, Tooltip } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

export default function RectangleChar({ swipes, likes, maches, conversations }) {
    const swipeBox = 350
    const likesBox = Math.sqrt(likes / swipes * swipeBox * swipeBox)
    const machesBox = Math.sqrt(maches / likes * likesBox * likesBox)
    const conversationsBox = Math.sqrt(conversations / maches * machesBox * machesBox)
    return (
        <Grid container
            alignItems="center"
            justifyContent="center">
            <Grid item xs={12} xl={6} sx={{ p: 1 }}>
                <Timeline position="alternate">
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot sx={{ backgroundColor: 'text.secondary' }} />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>Swipes: {swipes}</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot sx={{ backgroundColor: 'rgba(255, 99, 132, 1)' }} />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>Likes: {likes}</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot sx={{ backgroundColor: 'rgba(53, 162, 235, 1)' }} />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>Maches: {maches}</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot sx={{ backgroundColor: 'rgba(3, 62, 35, 1)' }} />
                        </TimelineSeparator>
                        <TimelineContent>Coversations: {conversations}</TimelineContent>
                    </TimelineItem>
                </Timeline>
            </Grid>
            <Grid item xs={12} xl={6} sx={{ p: 1 }}>
                <Tooltip title="Swipes" arrow>
                    <Box sx={{ width: swipeBox + 'px', height: swipeBox + 'px', border: '1px solid grey', backgroundColor: 'text.secondary', borderRadius: 2 }}>
                        <Tooltip title="Likes" arrow>
                            <Box sx={{ width: likesBox + "px", height: likesBox + "px", backgroundColor: 'rgba(255, 99, 132, 0.8)', borderRadius: 2 }}>
                                <Tooltip title="Maches" arrow>
                                    <Box sx={{ width: machesBox + "px", height: machesBox + "px", backgroundColor: 'rgba(53, 162, 235, 0.8)', borderRadius: 2 }}>
                                        <Tooltip title="Conversations" arrow placement="left">
                                            <Box sx={{ width: conversationsBox + "px", height: conversationsBox + "px", backgroundColor: 'rgba(3, 62, 35, 0.8)', borderRadius: 2 }} />
                                        </Tooltip>
                                    </Box>
                                </Tooltip>
                            </Box>
                        </Tooltip>
                    </Box>
                </Tooltip>
            </Grid>
        </Grid>
    )
}