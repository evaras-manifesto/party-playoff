const _ = require('lodash');
// const Promise = require("bluebird");

const Game = require('../schemas/game');
const Cards = require('./cards');

const stdErr = err => res.status(400).json(err);


module.exports = {
    events: (io) => {
        console.log('io.on');
        io.on('connection', (socket) => {
            console.log('a user connected');

            const sendUpdate = (id, message) => {
                return (info) => {
                    io.to(id).emit('updateGame', {message});
                    return info;
                }
            };

            socket.on('joinGameRoom', (data, send) => {
                console.log('joinGameRoom', data);

                _.forEach(socket.rooms, (eachRoom, index) => {
                    console.log(eachRoom, index);
                    socket.leave(eachRoom);
                });

                socket.join(data.gameId);

                sendUpdate(data.gameId, `${data.username} has connected!`)();
                send('complete')
            });

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

                game.save()
                    .then(send, stdErr);
            });

            socket.on('joinGame', (data, send) => {
                //{gameId:1, username:"Nazzanuk"}
                console.log('joinGame', data);

                Game.update({_id: data.gameId}, {$addToSet: {players: data.username}})
                    .then(sendUpdate(data.gameId, `${data.username} has joined the game!`))
                    .then(send, stdErr);
            });

            socket.on('vote', (data, send) => {
                //{gameId:1, username:"Nazzanuk", vote:'Adrian', currentRound:0}
                console.log('vote', data);

                Game.update({_id: data.gameId, 'rounds.index': data.currentRound},
                    {
                        $addToSet: {
                            'rounds.$.votes': {username: data.username, vote: data.vote}
                        }
                    })
                    .then(sendUpdate(data.gameId, `${data.username} has voted!`))
                    .then(send, stdErr);
            });

            socket.on('startGame', (data, send) => {
                //{gameId:1, username:"Nazzanuk"}
                console.log('startGame', data);

                Game.update({_id: data.gameId},
                    {
                        status: 'started',
                        currentRound: 0,
                        rounds: [Cards.generateRound(0)]
                    })
                    .then(sendUpdate(data.gameId, `${data.username} has started the game!`))
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