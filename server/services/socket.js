const _ = require('lodash');
// const Promise = require("bluebird");

const Game = require('../schemas/game');
const Cards = require('./cards');

const stdErr = err => res.status(400).json(err);

const rooms = [];


module.exports = {
    events: (io) => {
        console.log('io.on');
        io.on('connection', (socket) => {
            console.log('a user connected');

            const sendUpdate = (id, message) => {
                return (info) => {
                    io.to(id).emit('updateGame', {message});
                    // Game.update({_id: id},
                    //     {
                    //         $push: {
                    //             messages: {username: 'GameBot', text: message}
                    //         }
                    //     })
                    //     .then((game, z) => {
                    //         console.log('update msg', z, game);
                    //     });
                    return info;
                }
            };

            socket.on('joinGameRoom', (data, send) => {
                console.log('joinGameRoom', data);

                if (!_.includes(rooms, data.gameId)) {
                    rooms.push(data.gameId);
                }

                _.forEach(rooms, (eachRoom, index) => {
                    console.log('room', eachRoom, index);
                    socket.leave(eachRoom);
                });

                socket.join(data.gameId);

                sendUpdate(data.gameId, `${data.username} has connected!`)();
                send('complete');
            });

            socket.on('getAllGames', (data, send) => {
                //{username:"Nazzanuk"}
                console.log('getAllGames', data);

                Game.find({})
                    .then(send, stdErr);
            });

            socket.on('sendChat', (data, send) => {
                //{username:"Nazzanuk"}
                console.log('sendChat', data);

                Game.update({_id: data.gameId},
                    {
                        $push: {
                            messages: {username: data.username, text: data.chatMessage}
                        }
                    })
                    .then(sendUpdate(data.gameId, `${data.username}: ${data.chatMessage}`))
                    .then(send, stdErr);
            });

            socket.on('newRound', (data, send) => {
                //{
                //   username: 'Nazzanuk',
                //   gameId: 1,
                //   winners: ['Nazzanuk', 'Adrian'],
                //   currentRound: 1
                // }
                console.log('newRound', data);

                Game.update({_id: data.gameId, 'rounds.index': data.currentRound},
                    {
                        $addToSet: {
                            'rounds.$.winners': {$each: data.winners}
                        }
                    })
                    .then(game => {
                        return Game.update({_id: data.gameId},
                            {
                                currentRound: data.currentRound + 1,
                                $push: {
                                    'rounds': Cards.generateRound(data.currentRound + 1)
                                }
                            })
                    })
                    .then(sendUpdate(data.gameId, `${data.username} has started the next round!`))
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

            socket.on('leaveGame', (data, send) => {
                //{gameId:1, username:"Nazzanuk"}
                console.log('leaveGame', data);

                Game.update({_id: data.gameId},
                    {$pull: {players: data.username}})
                    .then(sendUpdate(data.gameId, `${data.username} has left the game!`))
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