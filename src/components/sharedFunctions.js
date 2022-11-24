export function getMsgFreq(totalMatch, conversationsFiltered, msgPerConversation) {
    let msgPerConversationFrq = { 0: totalMatch - conversationsFiltered.length, 1: 0, 2:0 };
    for (const num of msgPerConversation) {
        msgPerConversationFrq[num] = msgPerConversationFrq[num] ? msgPerConversationFrq[num] + 1 : 1;
    }
    return msgPerConversationFrq;
}

export function filterConversations(dateLabelComplete, dateFilter, conversations) {
    const conversationsFiltered = [];
    const startDate = new Date(dateLabelComplete[dateFilter[0]]);
    const endDate = new Date(dateLabelComplete[dateFilter[1] - 1]);
    for (const conversation of conversations) {
        let conversationFiltered = [];
        for (const message of conversation) {
            const msgDate = new Date(message.sent_date);
            if (startDate <= msgDate && msgDate <= endDate) {
                conversationFiltered.push(message);
            }
        }
        if (conversationFiltered.length)
            conversationsFiltered.push(conversationFiltered);
    }
    return conversationsFiltered;
}