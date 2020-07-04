// Requires
const express = require('express');
require('./routes/backend')
require('dotenv').config();
const slacklistener = require('./slacklistener')

// Slack
slacklistener.listen();

// Web Server
const port = 3000;

const app = express();
app.listen(port, () => {
    console.log("El servidor está inicializado en el puerto 3000 \m/");
});

app.get('/users/:userId/category', function (req, res) {
    const userId = req.params.userId
    res.send('Saludos a ' + userId + 'desde express');
});

app.get('/users/clapers', function (req, res) {
    const top = req.param('top')
    if(top == undefined) {
        res.send({
            message: 'A \'top\' value must be specified by queryparam'
        },400)
    }

    res.send('Saludos a ' + top + 'desde express');
});

app.get('/reactions/:reactionId', function(req,res) {
    const reactionId = req.params.reactionId

    res.send('reaction id: ' + reactionId)
})
