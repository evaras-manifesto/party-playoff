app.service('Notifications', class Notifications {

    show(message) {
        this.visible = true;
        this.message = message;

        this.$timeout(() => {
            this.visible = false;
        }, 2000);
    }

    constructor($timeout) {
        this.$timeout = $timeout;
        this.visible = false;
    }
});

