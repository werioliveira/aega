require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const server = express();
const session = require('./config/auth')
const routes = require('./routes');

server.use(session);
server.set('view engine', 'njk');
server.use(express.static('public'));
server.use(express.json())
server.use(express.urlencoded({extended: true}));
nunjucks.configure('./src/app/views', { express: server});


server.use(routes);

const port = process.env.PORT || 5000;


server.listen(port, function(){
    console.log('Server is running!');
});