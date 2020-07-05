// Requires
const express = require('express');
require('./routes/backend')
require('dotenv').config();
const slacklistener = require('./domain/slack/listener')

const userService = require('./domain/users')
const reactionsService = require('./domain/reactions')

// Slack
slacklistener.listen();

// Web Server
const port = 3000;

userService.simulateEventsForTesting()
reactionsService.simulateCreationForTesting()

const app = express();
app.listen(port, () => {
    console.log("El servidor está inicializado en el puerto 3000 \m/");
});

app.get('/users/:userId/category', function (req, res) {
    const userId = req.params.userId

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
    const top = req.query.top
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
    const reactionId = req.params.reactionId

    try {
        const usersOfReaction = reactionsService.usageOf(reactionId)

        res.set('Content-Type', 'application/json')
        res.send({
            reactionId: reactionId,
            usage: usersOfReaction
        });
    } catch (InvalidReactionId) {
        badRequest(res,'Reactions id ' +reactionId+' is not valid')
    }
})

function badRequest(res,message) {
    res.status(400).send({
        message: message
    })
}