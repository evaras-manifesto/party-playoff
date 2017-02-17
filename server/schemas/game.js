'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');

const GUID = require('../services/guid');

const schema = mongoose.Schema({
    _id: {type: String, required: true, default: GUID.generate},
    status: {type: String, default: 'new'},
    name: {type: String, required: true, default: 'Unnamed Game'},
    host: {type: String, required: true},
    players: [],
    cards: [],
    rounds: [],
    messages: [],
    currentRound: {type: Number, default: 1},
});

module.exports = mongoose.model('Game', schema);