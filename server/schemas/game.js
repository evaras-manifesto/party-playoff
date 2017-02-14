'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');

const GUID = require('../services/guid');

const schema = mongoose.Schema({
    _id: {type: String, required: true, default: GUID.generate},
    status: {type: String, default: 'new'},
    players: [],
    cards: [],
    rounds: []
});

module.exports = mongoose.model('Game', schema);