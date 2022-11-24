import React from 'react'
import { Box, Grid, Card, Typography } from '@mui/material';
import { getMsgFreq, filterConversations } from './sharedFunctions'
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
    ArcElement,
} from 'chart.js'
import { Chart, Pie } from 'react-chartjs-2'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import BasicTabs from './TabsPanel'
import RectangleChar from './RectangelChar'

import 'react-circular-progressbar/dist/styles.css'
ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
    ArcElement,
)

function SwipesTrend({ dateLabels, stat1Line, stat2bar, stat3bar, labelsY, title }) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'DailyStats',
            },
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    }

    const labels = dateLabels

    const data = {
        labels,
        datasets: [
            {
                label: labelsY[0],
                data: stat1Line,
                borderColor: 'rgb(03, 62, 35)',
                backgroundColor: 'rgba(3, 62, 35, 0.5)',
                type: 'line',
                yAxisID: 'y1',
            },
            {
                label: labelsY[1],
                data: stat2bar,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                type: 'bar',
            },
            {
                label: labelsY[2],
                data: stat3bar,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                type: 'bar',
            },
        ],
    }
    return (
        <Box>
            <Box sx={{ m: 0 }}>
                <Chart options={options} data={data} />
            </Box>
        </Box>
    )
}

function MessageTrend({ msgPerConversationFrq, title }) {
    const options = {
        responsive: false,
        plugins: {
            legend: {
                position: 'top',
                display: false,
            },
            title: {
                display: true,
                text: title,
            }
        },
    }

    const labels = Object.keys(msgPerConversationFrq).map(conv => conv + " messages")

    const data = {
        labels,
        datasets: [
            {
                label: "# of matches",
                data: Object.values(msgPerConversationFrq),
                type: 'pie',
                backgroundColor: getRandomColor(Object.values(msgPerConversationFrq).length),
                borderWidth: 1,
                borderJoinStyle: "round"
            },
        ],
    }
    return (
        <Box sx={{ m: 'auto' }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="10vh">
            <Pie height={250} options={options} data={data} />
        </Box>
    )
}

export function AllGraph({ tinderData, dateFilter }) {
    const labelsY = ["Maches", "Likes", "Passes"]
    const labelsY2 = ["App Open", "Msg Sent", "Msg Rec."]
    const labelY = ["Message sent", "", ""]
    // All
    const dateLabelComplete = Object.keys(tinderData.Usage.swipes_likes)
    const dateLabels = Object.keys(tinderData.Usage.swipes_likes).slice(dateFilter[0], dateFilter[1])
    const dateLikes = Object.values(tinderData.Usage.swipes_likes).slice(dateFilter[0], dateFilter[1])
    const datePasses = Object.values(tinderData.Usage.swipes_passes).slice(dateFilter[0], dateFilter[1])
    const dateMaches = Object.values(tinderData.Usage.matches).slice(dateFilter[0], dateFilter[1])
    const dateMessagesSent = Object.values(tinderData.Usage.messages_sent).slice(dateFilter[0], dateFilter[1])
    const dateMessagesReceived = Object.values(tinderData.Usage.messages_received).slice(dateFilter[0], dateFilter[1])
    const dateAppOpen = Object.values(tinderData.Usage.app_opens).slice(dateFilter[0], dateFilter[1])
    // By month
    const { dateMonthLikes, dateMonthPasses, dateMonthMaches, dateMonth, dateMonthAppOpen, dateMonthMessagesSent, dateMonthMessagesReceived } = buildMonthData()
    // Month percentage
    const { dateMonthMatchPercentage, dateMonthLikesPercentage } = buildMonthPercentage()
    // Group to weeks
    const { dateWeekDay, dateWeekDayMaches, dateWeekDayLikes, dateWeekDayPasses, dateWeekDayAppOpen, dateWeekDayMessagesSent, dateWeekDayMessagesReceived } = buildWeekData()
    // Overall
    const { totalMatch, totalLike, totalPasses, totalMessageReceived, totalMessageSent, totalAppOpen } = buildTotals(dateFilter)
    // Most used words, Top 10 conversation with starters
    const conversations = tinderData.Messages.map(conversation => conversation.messages)
    // Filder by date
    const conversationsFiltered = filterConversations(dateLabelComplete, dateFilter, conversations);
    let msgPerConversation = conversationsFiltered.map(messages => messages.length)
    // Frquency
    let msgPerConversationFrq = getMsgFreq(totalMatch, conversationsFiltered, msgPerConversation);
    // Message per hour
    let messagePerHour = buildHourData(conversationsFiltered)
    let hours = []
    let i = 0
    while (i < 24) {
        hours.push(i)
        i++
    }
    // Match per weekday
    let machRate = Math.round(totalMatch / totalLike * 10000) / 100
    let likeRate = Math.round(totalLike / (totalLike + totalPasses) * 10000) / 100
    let rawReplyRate = Math.round(totalMessageReceived / totalMessageSent * 10000) / 100
    let indicator1Labels = ["Like Rate", "Total Likes", "Total Passes"]
    let indicator3Labels = ["Reply Rate", "Total Message Sent", "Total Message Received"]
    let indicator2Labels = ["Match Rate", "Total Match", "Total Likes"]
    // Parallel conversations
    // Conversation sentiment - VADER 
    return (
        <Box>
            <Grid container spacing={2}>
                {Indicator(indicator1Labels, likeRate, totalLike, totalPasses)}
                {Indicator(indicator2Labels, machRate, totalMatch, totalLike)}
                {Indicator(indicator3Labels, rawReplyRate, totalMessageSent, totalMessageReceived)}
            </Grid>
            {simpleFlow()}
            {BasicTabs(
                <SwipesTrend dateLabels={dateMonth} stat1Line={dateMonthMaches} stat2bar={dateMonthLikes}
                    stat3bar={dateMonthPasses} labelsY={labelsY} title={"Monthly Stats"} />,
                <SwipesTrend dateLabels={dateMonth} stat1Line={dateMonthMatchPercentage} stat2bar={dateMonthLikesPercentage}
                    stat3bar={null} labelsY={labelsY} title={"Right Swipes % and Match rate %"} />,
                <SwipesTrend dateLabels={dateMonth} stat1Line={dateMonthAppOpen} stat2bar={dateMonthMessagesSent}
                    stat3bar={dateMonthMessagesReceived} labelsY={labelsY2} title={"Messages and App Open"} />,
                ["Swipes and maches", "Like and maches %", "App Open and messages"],
                "Montly Stats"
            )}
            {BasicTabs(
                <SwipesTrend dateLabels={dateWeekDay} stat1Line={dateWeekDayMaches} stat2bar={dateWeekDayLikes}
                    stat3bar={dateWeekDayPasses} labelsY={labelsY} title={"Weekday Stats"} />,
                <SwipesTrend dateLabels={dateWeekDay} stat1Line={dateWeekDayAppOpen} stat2bar={dateWeekDayMessagesSent}
                    stat3bar={dateWeekDayMessagesReceived} labelsY={labelsY2} title={"Messages and App Open"} />,
                <SwipesTrend dateLabels={hours} stat1Line={messagePerHour} stat2bar={null} stat3bar={null} labelsY={labelY} title={"Messages per hours"} />,
                ["Swipes and maches", "App Open and messages", "Messages per hour"],
                "Weekday Stats"
            )}
            {BasicTabs(
                <SwipesTrend dateLabels={dateLabels} stat1Line={dateMaches} stat2bar={dateLikes} stat3bar={datePasses.map(val => -val)} labelsY={labelsY} title={"Daily Stats"} />,
                <MessageTrend msgPerConversationFrq={msgPerConversationFrq} title={"Messages per match"} />,
                <div></div>,
                ["Daily Stats", "Messages per match", ""],
                "Other Charts"
            )}
        </Box>
    )

    function simpleFlow() {
        return (
            <Card variant="outlined" sx={{ mt: 2, border: '1px solid grey' }}>
                <Box sx={{ m: 1, borderBottom: '1px solid grey' }}>
                    <Typography gutterBottom variant="h4" component="div" sx={{ m: '2px' }}>
                        Simple flow
                    </Typography>
                </Box>
                <Box sx={{ m: 1 }}>
                    <Typography gutterBottom variant="body" component="div" sx={{ m: '2px' }}>
                        You opened Tinder {totalAppOpen} times, then swiped {totalLike + totalPasses} times, you liked {totalLike} profile, {totalMatch} liked you back,
                        you had no interest with {msgPerConversationFrq[0]} maches, {msgPerConversationFrq[1] + msgPerConversationFrq[2]} didn't replied you back,
                        you had {totalMatch - (msgPerConversationFrq[0] + msgPerConversationFrq[1] + msgPerConversationFrq[2])} conversations in {dateLabels.length} days of activity.
                    </Typography>
                </Box>
                <RectangleChar swipes={totalLike + totalPasses} likes={totalLike} maches={totalMatch} conversations={totalMatch - (msgPerConversationFrq[0] + msgPerConversationFrq[1] + msgPerConversationFrq[2])} />
            </Card>
        );
    }

    function buildWeekData() {
        let i = 0
        let dateWeekDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        let dateWeekDayLikes = [0, 0, 0, 0, 0, 0, 0]
        let dateWeekDayPasses = [0, 0, 0, 0, 0, 0, 0]
        let dateWeekDayMaches = [0, 0, 0, 0, 0, 0, 0]
        let dateWeekDayMessagesSent = [0, 0, 0, 0, 0, 0, 0]
        let dateWeekDayMessagesReceived = [0, 0, 0, 0, 0, 0, 0]
        let dateWeekDayAppOpen = [0, 0, 0, 0, 0, 0, 0]
        for (const stringDate of dateLabels) {
            let date = new Date(stringDate)
            let indexToUpdate = date.getDay()
            dateWeekDayLikes[indexToUpdate] += dateLikes[i]
            dateWeekDayPasses[indexToUpdate] += datePasses[i]
            dateWeekDayMaches[indexToUpdate] += dateMaches[i]
            dateWeekDayMessagesSent[indexToUpdate] += dateMessagesSent[i]
            dateWeekDayMessagesReceived[indexToUpdate] += dateMessagesReceived[i]
            dateWeekDayAppOpen[indexToUpdate] += dateAppOpen[i]
            i++
        }
        return { dateWeekDay, dateWeekDayMaches, dateWeekDayLikes, dateWeekDayPasses, dateWeekDayAppOpen, dateWeekDayMessagesSent, dateWeekDayMessagesReceived }
    }

    function buildMonthPercentage() {
        let dateMonthLikesPercentage = []
        let dateMonthMatchPercentage = []
        let i = 0
        for (const likes of dateMonthLikes) {
            dateMonthLikesPercentage.push(Math.round(likes / (likes + dateMonthPasses[i]) * 10000) / 100)
            dateMonthMatchPercentage.push(Math.round(dateMonthMaches[i] / (likes + dateMonthMaches[i]) * 10000) / 100)
            i++
        }
        return { dateMonthMatchPercentage, dateMonthLikesPercentage }
    }

    function buildMonthData() {
        let dateMonth = []
        let dateMonthLikes = []
        let dateMonthPasses = []
        let dateMonthMaches = []
        let dateMonthMessagesSent = []
        let dateMonthMessagesReceived = []
        let dateMonthAppOpen = []

        // Group to months
        let currMonth = (new Date(dateLabels[0])).getMonth()
        let currLikes = 0
        let currPasses = 0
        let currMaches = 0
        let currMessagesSent = 0
        let currMessagesReceived = 0
        let currAppOpen = 0
        let i = 0
        let currDate
        for (const stringDate of dateLabels) {
            currDate = new Date(stringDate)
            if (currDate.getMonth() === currMonth) {
                currLikes += dateLikes[i]
                currPasses += datePasses[i]
                currMaches += dateMaches[i]
                currMessagesSent += dateMessagesSent[i]
                currMessagesReceived += dateMessagesReceived[i]
                currAppOpen += dateAppOpen[i]
            } else {
                dateMonth.push(currDate.getFullYear() + "-" + (currMonth + 1))
                dateMonthLikes.push(currLikes)
                dateMonthPasses.push(currPasses)
                dateMonthMaches.push(currMaches)
                dateMonthMessagesSent.push(currMessagesSent)
                dateMonthMessagesReceived.push(currMessagesReceived)
                dateMonthAppOpen.push(currAppOpen)
                currMonth = (currMonth === 11) ? 0 : currMonth + 1
                currLikes = dateLikes[i]
                currPasses = datePasses[i]
                currMaches = dateMaches[i]
                currMessagesSent = dateMessagesSent[i]
                currMessagesReceived = dateMessagesReceived[i]
                currAppOpen = dateAppOpen[i]
            }
            i++
        }
        dateMonth.push(currDate.getFullYear() + "-" + (currMonth + 1))
        dateMonthLikes.push(currLikes)
        dateMonthPasses.push(currPasses)
        dateMonthMaches.push(currMaches)
        dateMonthMessagesSent.push(currMessagesSent)
        dateMonthMessagesReceived.push(currMessagesReceived)
        dateMonthAppOpen.push(currAppOpen)
        return { dateMonthLikes, dateMonthPasses, dateMonthMaches, dateMonth, dateMonthAppOpen, dateMonthMessagesSent, dateMonthMessagesReceived }
    }

    function buildTotals() {
        let totalLike = Object.values(tinderData.Usage.swipes_likes).slice(dateFilter[0], dateFilter[1]).reduce((partialSum, a) => partialSum + a, 0)
        let totalPasses = Object.values(tinderData.Usage.swipes_passes).slice(dateFilter[0], dateFilter[1]).reduce((partialSum, a) => partialSum + a, 0)
        let totalMatch = Object.values(tinderData.Usage.matches).slice(dateFilter[0], dateFilter[1]).reduce((partialSum, a) => partialSum + a, 0)
        let totalMessageSent = Object.values(tinderData.Usage.messages_sent).slice(dateFilter[0], dateFilter[1]).reduce((partialSum, a) => partialSum + a, 0)
        let totalMessageReceived = Object.values(tinderData.Usage.messages_received).slice(dateFilter[0], dateFilter[1]).reduce((partialSum, a) => partialSum + a, 0)
        let totalAppOpen = Object.values(tinderData.Usage.app_opens).slice(dateFilter[0], dateFilter[1]).reduce((partialSum, a) => partialSum + a, 0)
        return { totalMatch, totalLike, totalPasses, totalMessageReceived, totalMessageSent, totalAppOpen }
    }

}

function Indicator(indicator1Labels, likeRate, totalLike, totalPasses) {
    return (
        <Grid item xs={12} xl={4}>
            <Card variant="outlined" sx={{ border: '1px solid grey', borderColor: 'text.secondary' }}>
                <Grid container>
                    <Grid item xs={8}>
                        <Box sx={{ m: 1, borderBottom: '1px solid grey' }}>
                            <Typography gutterBottom variant="h4" component="div">
                                {indicator1Labels[0]}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignContent: 'space-around',
                                borderRadius: 1,
                            }}
                        >
                            <Box sx={{ m: 1, width: '100%', }}>
                                <Typography variant="body" color="text.secondary">{indicator1Labels[1]}: {totalLike}</Typography>
                            </Box>
                            <Box sx={{ m: 1, width: '100%', }}>
                                <Typography variant="body" color="text.secondary">{indicator1Labels[2]}: {totalPasses}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignContent: 'center',
                            p: 1
                        }}
                        >
                            <CircularProgressbar
                                value={likeRate}
                                text={`${likeRate}%`}
                                background
                                backgroundPadding={6}
                                styles={buildStyles({
                                    backgroundColor: "#3e98c7",
                                    textSize: '16px',
                                    textColor: "#fff",
                                    pathColor: "#fff",
                                    trailColor: "transparent"
                                })} />
                        </Box>
                    </Grid>
                </Grid>
            </Card >
        </Grid >
    )
}

function getRandomColor(length) { //generates random colours and puts them in string
    let colors = []
    for (let i = 0; i < length; i++) {
        let letters = '0123456789ABCDEF'.split('')
        let color = '#'
        for (let x = 0; x < 6; x++) {
            color += letters[Math.floor(Math.random() * 16)]
        }
        colors.push(color)
    }
    return colors
}

function buildHourData(conversations) {
    let msgPerHour = new Array(24).fill(0);
    for (const conversation of conversations) {
        for (const message of conversation) {
            const sentDate = new Date(message.sent_date)
            msgPerHour[sentDate.getHours()] = msgPerHour[sentDate.getHours()] ? msgPerHour[sentDate.getHours()] + 1 : 1
        }
    }
    return msgPerHour
}
