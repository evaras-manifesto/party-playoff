'use strict';

const Get = require('./get');
const Post = require('./post');

module.exports = {
    init: (app) => {

        app.get('/api/new-game/', Post.game);

        app.get('/api/game/:_id', Get.game);
        app.get('/api/games', Get.games);
        // app.get('/api/*', Get.index);

        app.get('*', Get.index);
    }
};