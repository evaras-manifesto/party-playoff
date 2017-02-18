'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');

const GUID = require('../services/guid');
const Cards = require('../services/cards');

const schema = mongoose.Schema({
    _id: {type: String, required: true, default: GUID.generate},
    status: {type: String, default: 'new'},
    host: {type: String, required: true},
    players: [],
    cards: {type: [], default: Cards.generate},
    rounds: [],
    messages: [],
    currentRound: {type: Number, default: 0},
});

const round = {
    votes: [
        {
            username: 'Nazzanuk',
            vote: 'Adrian'
        }
    ],

    guesses: [
        {
            username: 'Nazzanuk',
            guess: 'Adrian'
        }
    ]
};

module.exports = mongoose.model('Game', schema);
