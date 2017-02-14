app.service('API', ($state, $stateParams, $timeout, $http) => {

    const API = "/";

    const getReq = (url, data, type = 'get') => {
        return $http[type](url, {params:data}).then(response => {
            console.log('req response', response);
            return response.data;
        }, err => {
            console.error(err);
            return $q.reject();
        });
    };

    const load = (url, data) => getReq(API + url, data);

    const loadNewsCard = (data) => getReq(API + "public/json/news-card.json", data);

    const init = () => {

    };

    init();

    return {
        load,
        loadNewsCard
    }
});

