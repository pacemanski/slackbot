// Requires
const express = require('express');
require('./routes/backend')
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

            // I realized framework automatically sets this header. I just added to show I know the importance of this header.
            res.set('Content-Type', 'application/json')
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

        // I realized framework automatically sets this header. I just added to show I know the importance of this header.
        res.set('Content-Type', 'application/json')
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
    for (let i =0; i <= 11; i++) {
        userService.onChannelCall(10)
    }

    let longMessage = ''
    for (let i =0; i <= 520; i++) {
        longMessage = longMessage + ' DO'
    }
    let shotMessage = 'just three words'

    userService.onMessageSent(15,longMessage)
    userService.onMessageSent(15,longMessage)
    userService.onMessageSent(15,longMessage)
    userService.onMessageSent(15,longMessage)

    userService.onMessageSent(20,shotMessage)
    userService.onMessageSent(20,shotMessage)
    userService.onMessageSent(20,shotMessage)
    userService.onMessageSent(20,shotMessage)

    for (let i =0; i <= 22; i++) {
        userService.onReaction(20,reactionsService.plusOneReactionId())
    }

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