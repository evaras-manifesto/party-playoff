const _ = require('lodash');

const Game = require('../schemas/game');

const stdErr = err => res.status(400).json(err);

// var Mongo = require('./mongo-service');

module.exports = {
    events: (io) => {
        console.log('io.on');
        io.on('connection', (socket) => {
            console.log('a user connected');

            socket.on('getAllGames', (data) => {
                //{username:"Nazzanuk"}
                console.log('getAllGames', data);

                Game.find({})
                    .then(results => socket.emit('allGamesList', results), stdErr);
            });

            socket.on('addGame', (data) => {
                //{username:"Nazzanuk", gameName:'Winners'}
                console.log('addGame', data);

                new Game({host:data.username}).save()
                    .then(game => socket.emit('gameAdded', game), stdErr);
            });


            socket.on('addUser', (data) => {
                //{gameId:1, username: Nazzanuk}
                console.log('addUser', data);

                Game.find({})
                    .then(results => socket.emit('allGamesList', results), stdErr);

                new Game({host:data.username}).save()
                    .then(game => socket.emit('gameAdded', game), stdErr);
            });

            // socket.on('addGame', Logic.addGame);

            // socket.on('addUser', Logic.addUser);

            // socket.on('removeUser', Logic.removeUser);


        });

        /*
        app.post('/api/game/:gameId/add-user', unset); // {username: Nazzanuk}
        app.post('/api/game/:gameId/remove-user', unset); // {username: 'Nazzanuk'}
        app.post('/api/game/:gameId/start', unset); // {username: 'Nazzanuk'}
        app.post('/api/game/:gameId/new-round', unset); // {username: 'Nazzanuk'}
        app.post('/api/game/:gameId/vote', unset); // {username: 'Nazzanuk', round:1, vote: 'Adrian'}
        app.post('/api/game/:gameId/guesses', unset); // {username: 'Nazzanuk', round:1, guesses: ['Adrian', 'Billy']}
        app.post('/api/game/:gameId/message', unset); // {username: 'Nazzanuk', message:'hello'}
        */

        io.on('disconnect', () => console.log('user disconnected'));
    }
};