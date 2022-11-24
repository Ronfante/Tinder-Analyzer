import React, { useState, useRef, useEffect } from 'react'
import { Box, Grid, Card, Typography, Accordion, AccordionSummary, AccordionDetails, Tooltip, Skeleton } from '@mui/material';
import { getMsgFreq, filterConversations } from './sharedFunctions'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EmailIcon from '@mui/icons-material/Email'
import FavoriteIcon from '@mui/icons-material/Favorite';
import WordSlider from './WordSlider'
import BasicTabs from './TabsPanel'

export default function ChatAnalysis({ tinderData, dateFilter }) {
    const [wordFilter, setWordFilter] = useState([1, 99])
    function dataFromSlider(wordFilter) {
        setWordFilter(wordFilter)
    }
    let { topConversations, allSentText } = extractTopConversationsAndText(tinderData, dateFilter)
    // Top 10 conversation
    topConversations = topConversations.sort().reverse()
    // Top words
    const [top10freqWords, top10LenWords, totalWords] = countRepeatedWords(allSentText, wordFilter)
    // Max Word Length
    const maxWordLen = useRef(top10LenWords[0] ? top10LenWords[0][0].length : 0)
    return (
        <Box sx={{ width: '100%', paddingBottom: 2 }}>
            {BasicTabs(
                <Box>
                    <WordSlider dataFromSlider={dataFromSlider} wordRange={[1, maxWordLen.current]} />
                    <Box sx={{ m: 1 }}>
                        <Typography gutterBottom variant="body" sx={{ m: 1 }}>
                            You wrote: {totalWords} different words between {wordFilter[0]} and {wordFilter[1] === 99 ? maxWordLen.current : wordFilter[1]} characters
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} xl={6}>
                                <Typography gutterBottom variant="h5" sx={{ m: 0 }}>
                                    By Occurencies
                                </Typography>
                                <TopWords topWords={top10freqWords}></TopWords>
                            </Grid>
                            <Grid item xs={12} xl={6}>
                                <Typography gutterBottom variant="h5" sx={{ m: 0 }}>
                                    By Length
                                </Typography>
                                <TopWords topWords={top10LenWords}></TopWords>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>,
                <TopConversations topConversations={topConversations} title={"Top 10 startes"} />,
                <AllConversations conversations={tinderData.Messages} />,
                ["Top Words", "Top 10 startes", "Chats"],
                "Messages stats"
            )}
        </Box>
    )
}

function AllConversations({ conversations }) {
    useEffect(() => {
        setElaborated(true)
    }, []);
    const [elaborated, setElaborated] = useState(false)
    let keyID = 0
    const vader = require('vader-sentiment');
    if (!elaborated) {
        return (<Skeleton variant="rounded" height={600} />)
    }
    else {
        return (
            <Box>
                {conversations.map(conversation => (
                    <Accordion key={keyID + "-stats"} elevation={1} TransitionProps={{ unmountOnExit: true }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ width: '33%' }}>{conversation.match_id}</Typography>
                            <Tooltip title="Message number" arrow><EmailIcon sx={{ mr: 1 }} /></Tooltip>
                            <Typography variant='body1' sx={{ width: '22%', color: 'text.secondary' }}>
                                {conversation.messages.length}
                            </Typography>
                            <Tooltip title="Sentiment" arrow><FavoriteIcon sx={{ mr: 1 }} /></Tooltip>
                            <Typography variant='body1' sx={{ width: '22%', color: 'text.secondary' }}>
                                {
                                    Math.round(conversation.messages.reduce((partialSum, message) =>
                                        partialSum + vader.SentimentIntensityAnalyzer.polarity_scores(message.message).compound, 0) / conversation.messages.length * 100) / 100
                                }
                            </Typography>
                            <Typography variant='body1' sx={{ width: '22%', color: 'text.secondary' }}>
                                {(new Date(conversation.messages[0].sent_date)).toLocaleDateString("en-US")}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {conversation.messages.map(message => (
                                <Box key={keyID + "-box"}{...keyID++}>
                                    <Card variant="outlined" sx={{ width: '500px', p: 1, mt: 1, border: '1px solid grey' }}>
                                        <Tooltip title={message.sent_date} arrow>
                                            <Typography>
                                                {message.message}
                                            </Typography>
                                        </Tooltip>
                                    </Card>
                                    <Typography variant='subtitle2' sx={{ width: '500px' }} align="right">
                                        <Tooltip title="Vader Score" arrow>
                                            <Box>
                                                {vader.SentimentIntensityAnalyzer.polarity_scores(message.message).compound}
                                            </Box>
                                        </Tooltip>
                                    </Typography>
                                </Box>

                            ))}
                        </AccordionDetails>
                    </Accordion>
                ))
                }
            </Box>
        )
    }
}

function countRepeatedWords(sentence, wordFilter) {
    let words = sentence.replace(/[^a-zA-Z0-9 ']/g, " ").toLowerCase().split(/(?: |')+/)
    let wordMap = {}

    for (let i = 0; i < words.length; i++) {
        if (words[i] !== "" && words[i].length >= wordFilter[0] && words[i].length <= wordFilter[1] && !(/\d/.test(words[i]))) {
            let currentWordCount = wordMap[words[i]]
            let count = currentWordCount ? currentWordCount : 0
            wordMap[words[i]] = count + 1
        }
    }
    let sortedByFreqwordMap = []
    for (let word in wordMap) {
        sortedByFreqwordMap.push([word, wordMap[word]])
    }
    let sortedByLengthwordMap = [...sortedByFreqwordMap]
    sortedByFreqwordMap.sort(function (a, b) {
        return b[1] - a[1]
    })
    sortedByLengthwordMap.sort(function (a, b) {
        return b[0].length - a[0].length
    })
    return [sortedByFreqwordMap.slice(0, 10), sortedByLengthwordMap.slice(0, 10), sortedByLengthwordMap.length]

}

function extractTopConversationsAndText(tinderData, dateFilter) {
    // Most used words, Top 10 conversation with starters
    const conversations = tinderData.Messages.map(conversation => conversation.messages)
    // Filder by date
    const dateLabelComplete = Object.keys(tinderData.Usage.swipes_likes)
    const conversationsFiltered = filterConversations(dateLabelComplete, dateFilter, conversations);
    let msgPerConversation = conversationsFiltered.map(messages => messages.length)
    // Frquency
    const totalMatch = Object.values(tinderData.Usage.matches).reduce((partialSum, a) => partialSum + a, 0)
    let msgPerConversationFrq = getMsgFreq(totalMatch, conversationsFiltered, msgPerConversation);
    let msgQty = Object.values(msgPerConversationFrq)
    let msgNumbers = Object.keys(msgPerConversationFrq)
    let sum = 0
    let i = 1
    while (sum < 10) {
        sum += msgQty[msgQty.length - i]
        i++
    }
    let topConversations = []
    let minMsg = msgNumbers[msgQty.length - i]
    let allSentText = ""
    for (const conversation of conversationsFiltered) {
        allSentText = getText(conversation, allSentText)
        if (conversation.length > minMsg) {
            topConversations.push([conversation.length, conversation[0].message, conversation[0].sent_date])
        }
    }
    return { topConversations, allSentText }
}

function getText(conversation, allSentText) {
    conversation.forEach(convData => {
        allSentText += " " + convData.message
    })
    return allSentText
}

function TopConversations({ topConversations, title }) {
    let keyID = 0
    return (
        <Box sx={{ m: 1 }}>
            <ol>
                {topConversations.map(conversation => (
                    <li key={"conv-" + keyID}{...keyID++}>
                        <div>
                            Messages quantity: {conversation[0]}
                        </div>
                        <div>
                            Date: {conversation[2]}
                        </div>
                        <div>
                            Content: {conversation[1]}
                        </div>
                    </li>
                ))}
            </ol>
        </Box>
    )
}

function TopWords({ topWords }) {
    let keyID = 0
    return (
        <ol>
            {topWords.map(word => (
                <li key={"word-" + keyID}{...keyID++}>
                    <div>
                        Word: {word[0]}
                    </div>
                    <div>
                        Occurencies: {word[1]}
                    </div>
                </li>
            ))}
        </ol>
    )
}