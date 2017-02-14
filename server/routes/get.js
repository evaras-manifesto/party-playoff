'use strict';

// const Post = require('./post');
const Game = require('../schemas/game');

const stdErr = err => res.status(400).json(err);

module.exports = {
    game(req, res) {
        console.log(req.params);

        Game.findOne(req.params)
            .then(results => res.status(200).json(results), stdErr);
    },

    games(req, res) {
        console.log(req.params);

        Game.find({})
            .then(results => res.status(200).json(results), stdErr);
    },

    index(req, res) {
        res.render('index', {title: "Angular Base"});
    }
};