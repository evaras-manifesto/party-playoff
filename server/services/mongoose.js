'use strict';

//npm dependencies
const mongoose = require('mongoose');
const _ = require('lodash');

//local dependencies
// const User = require('../schemas/user');

const url = 'mongodb://nathan:nathan@ds149479.mlab.com:49479/heroku_k9gfzkzj';

mongoose.Promise = global.Promise;
mongoose.connect(url);

// Configure mongoose for debug
mongoose.set('debug', (collectionName, method, query, doc, options) => {
    //console.log('mongo %s %s ->', collectionName, method, query, doc, options);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('db connected');

    //const user = new User({
    //    email: "demo",
    //    password: "demo",
    //    firstName: "demo",
    //    lastName: "demo"
    //});
    //
    //user.save((a,b) => {
    //    console.log(a);
    //    console.log(b);
    //    console.log("user saved");
    //}, console.error);
    //
    //console.log('user');
    //console.log(user);
});

module.exports = db;