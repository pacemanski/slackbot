const http = require('http');
require('dotenv').config();

const hostname = '127.0.0.1';
const port = 3000;

const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Alter Bridge rocckss! ' + SLACK_TOKEN);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});