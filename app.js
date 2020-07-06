// Requires
const express = require('express');
require('dotenv').config();

const userService = require('./domain/users')
const reactionsService = require('./domain/reactions')

// Slack Listener
startListeningSlack()

// Load testing data because it doesnt connect with slack for some reason
simulateSlackActivity()

// Web Server
setUpWebServer(3000)

function setUpWebServer(port) {
    const app = express();

    app.use(function (req,res,next) {
        // I needed this in order to deactivate CORS for the UI. I would explore for a beter solution if I have had
        // more time.
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Content-Type', 'application/json')
        next()
    })

    setUpControllers(app)

    app.listen(port, () => {
        console.log("El servidor está inicializado en el puerto 3000 \m/");
    });
}

function setUpControllers(app) {
    app.get('/users/:userId/category', function (req, res) {
        let userId = req.params.userId

        try {
            const classResult = userService.classify(userId)

            res.send({
                userId: userId,
                class: classResult
            });
        } catch (InvalidUserId) {
            badRequest(res,'User id ' +userId+' is not valid')
        }
    });

    app.get('/users/clapers', function (req, res) {
        let top = req.query.top
        if(top == undefined) {
            badRequest(res,'A \'top\' queryparam value must be provided')
        } else {
            const clappers = userService.findClappers(top)
            res.send({
                clappers : clappers.map( user => {
                    return {
                        userId:user.userId,
                        times:user.activity.reactions[reactionsService.clapReactionId()]
                    }
                })
            });
        }
    });

    app.get('/reactions/:reactionId', function(req,res) {
        let reactionId = req.params.reactionId

        let usersOfReaction = reactionsService.usageOf(reactionId)

        res.send({
            reactionId: reactionId,
            usage: usersOfReaction
        });
    })
}

function badRequest(res,message) {
    res.status(400).send({
        message: message
    })
}

function startListeningSlack() {
    const { RTMClient } = require('@slack/rtm-api');

    const rtm = new RTMClient(process.env.SLACK_BOT_TOKEN);

    rtm.on('message',(event) => {
        console.log('new message',JSON.stringify(event,null,2));
        userService.onMessageSent(event.user,event.text)
    });

    rtm.on('reaction_added',(event) => {
        console.log('new reaction',JSON.stringify(event,null,2));
        userService.onReaction(event.user,event.reaction)
    });

    rtm.on('connected', (c) => {
        console.log("On connected event. Is connected? " + rtm.connected)
    });

    rtm.on('unable_to_rtm_start', (error) => {
        console.log("Unable to start RTM")
        console.log(error)
    });

    (async() => {
        await rtm.start();
        console.log("After await. Is connected? " + rtm.connected)
    })();

}

function simulateSlackActivity() {
    // user 10: makes @channel ten times
    for (let i =0; i <= 11; i++) {
        userService.onChannelCall(10)
    }

    // user 15: makes WallOfText 4 times
    let longMessage = ''
    for (let i =0; i <= 520; i++) {
        longMessage = longMessage + ' DO'
    }

    userService.onMessageSent(15,longMessage)
    userService.onMessageSent(15,longMessage)
    userService.onMessageSent(15,longMessage)
    userService.onMessageSent(15,longMessage)

    // user 20: sends 4 messages shorter than 500 words. Wont be WallOfText
    let shotMessage = 'just three words'
    userService.onMessageSent(20,shotMessage)
    userService.onMessageSent(20,shotMessage)
    userService.onMessageSent(20,shotMessage)
    userService.onMessageSent(20,shotMessage)

    // user 20: Reacts with thumbs up more than 20 times
    for (let i =0; i <= 22; i++) {
        userService.onReaction(20,reactionsService.plusOneReactionId())
    }

    // Users clapping:
    //      - user 10: 2 times
    //      - user 15: 3 times
    //      - user 20: 4 times

    userService.onReaction(10, reactionsService.clapReactionId())
    userService.onReaction(10, reactionsService.clapReactionId())
    userService.onReaction(15, reactionsService.clapReactionId())
    userService.onReaction(15, reactionsService.clapReactionId())
    userService.onReaction(15, reactionsService.clapReactionId())
    userService.onReaction(20, reactionsService.clapReactionId())
    userService.onReaction(20, reactionsService.clapReactionId())
    userService.onReaction(20, reactionsService.clapReactionId())
    userService.onReaction(20, reactionsService.clapReactionId())
}