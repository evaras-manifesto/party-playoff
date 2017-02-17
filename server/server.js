'use strict';

//npm dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Mongoose = require('./services/mongoose');

//local dependencies
const routes = require('./routes/routes');

//server setup
const app = express(),
    port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('../release'));
app.set('view engine', 'ejs');

const server = app.listen(port, () => {
    console.log('Example app listening at http://localhost:%s', port);
});

//define our routes
routes.init(app);

const io = require('socket.io')(server);

const socket = require('./services/socket');
socket.events(io);

//in case we need the instance later
module.exports = server;