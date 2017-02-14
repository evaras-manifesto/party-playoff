'use strict';

const _ = require('lodash');

const Game = require('../schemas/game');

const stdErr = err => res.status(400).json(err);

module.exports = {

    game(req, res) {
        new Game({}).save()
            .then(game => res.status(201).send(game), stdErr);
    }
};

