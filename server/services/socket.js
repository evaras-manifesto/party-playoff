const _ = require('lodash');
// const Promise = require("bluebird");

const Game = require('../schemas/game');

const stdErr = err => res.status(400).json(err);


module.exports = {
    events: (io) => {
        console.log('io.on');
        io.on('connection', (socket) => {
            console.log('a user connected');

            socket.on('getAllGames', (data, send) => {
                //{username:"Nazzanuk"}
                console.log('getAllGames', data);

                Game.find({})
                    .then(send, stdErr);
            });

            socket.on('addGame', (data, send) => {
                //{username:"Nazzanuk"}
                console.log('addGame', data);

                const game = new Game({
                    host: data.username,
                    players: [data.username]
                });

                console.log('game', game);

                game.save()
                    .then(data => {
                        console.log('game created', data);
                        return data;
                    })
                    .then(send, stdErr);
            });

            socket.on('getMyGames', (data, send) => {
                //{username:"Nazzanuk"}
                console.log('getMyGames', data);

                Game.find({host: data.username})
                    .then(send, stdErr);
            });

            socket.on('getGame', (data, send) => {
                //{gameId:1, username:"Nazzanuk"}
                console.log('getGame', data);

                Game.findOne({_id: data.gameId})
                    .then(send, stdErr);
            });
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