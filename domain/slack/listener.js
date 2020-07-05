
function listenSlack() {
    const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN;

    const { RTMClient } = require('@slack/rtm-api');
    const rtm = new RTMClient(SLACK_TOKEN);

    // See: https://api.slack.com/events/message
    rtm.on('message',(event) => {
        console.log('new message',JSON.stringify(event,null,2));
    });

    rtm.on('connected', (c) => {
        console.log("is connected? " + rtm.connected)
    });

    // See: https://api.slack.com/events/reaction_added
    rtm.on('reaction_added',(event) => {
        console.log('new reaction',JSON.stringify(event,null,2));
    });

    rtm.on('unable_to_rtm_start', (error) => {
        console.log(error)
    });

    (async() => {
        await rtm.start();
        console.log(rtm.connected)
    })();
}

module.exports.listen = listenSlack