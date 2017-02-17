const _ = require('lodash');


const Game = require('../schemas/game');

const stdErr = err => res.status(400).json(err);

module.exports = {
    getAllGames(socket, data) {
        console.log('getAllGames', data);
        Game.find({})
            .then(results => socket.emit('invalid-login', results), stdErr);
    },

    addGame(socket, data) {
        new Game({host:data.username}).save()
            .then(game => res.status(201).send(game), stdErr);

    },

    addUser(socket, data) {


    },

    removeUser(socket, data) {

    },




};

/*
 app.post('/api/game/:gameId/add-user', unset); // {username: Nazzanuk}
 app.post('/api/game/:gameId/remove-user', unset); // {username: 'Nazzanuk'}
 app.post('/api/game/:gameId/start', unset); // {username: 'Nazzanuk'}
 app.post('/api/game/:gameId/new-round', unset); // {username: 'Nazzanuk'}
 app.post('/api/game/:gameId/vote', unset); // {username: 'Nazzanuk', round:1, vote: 'Adrian'}
 app.post('/api/game/:gameId/guesses', unset); // {username: 'Nazzanuk', round:1, guesses: ['Adrian', 'Billy']}
 app.post('/api/game/:gameId/message', unset); // {username: 'Nazzanuk', message:'hello'}
 */